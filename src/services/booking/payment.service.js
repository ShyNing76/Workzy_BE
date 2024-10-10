import paypal from "@paypal/checkout-server-sdk";
import axios from "axios";
import client from "../../config/paypal.config.js";
import db from "../../models/index.js";

const getExchangeRate = async (fromCurrency, toCurrency) => {
    try {
        const response = await axios.get(
            `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        const rates = response.data.rates;
        return rates[toCurrency];
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        throw new Error("Failed to fetch exchange rate");
    }
};

const convertVNDToUSD = async (amount) => {
    const exchangeRate = await getExchangeRate("VND", "USD");

    return (amount * exchangeRate).toFixed(2).toString();
};

export const paypalCheckoutService = ({ booking_id, user_id }) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const customer = await db.Customer.findOne({
                where: {
                    user_id: user_id,
                },
            });

            if (!customer) return reject("Customer not found");

            const booking = await db.Booking.findOne({
                where: {
                    booking_id: booking_id,
                    customer_id: customer.customer_id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                include: [
                    {
                        model: db.Workspace,
                        as: "Workspace",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "workspace_id",
                                "workspace_type_id",
                                "building_id",
                            ],
                        },
                    },
                    {
                        model: db.BookingType,
                        as: "BookingType",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "booking_type_id",
                            ],
                        },
                    },
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "booking_status_id",
                                "booking_id",
                            ],
                        },
                    },
                ],
            });

            if (!booking) return reject("Booking not found");
            if (booking.BookingStatuses[0].status !== "confirmed")
                return reject("Booking not confirmed");
            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking already cancelled");

            const payment = await db.Payment.create(
                {
                    booking_id: booking.booking_id,
                    amount: booking.workspace_price,
                    payment_method: "paypal",
                    payment_date: new Date(),
                    payment_type: "Workspace-Price",
                },
                { transaction: t }
            );

            const transaction = await db.Transaction.create(
                {
                    payment_id: payment.payment_id,
                    status: "In-processing",
                },
                { transaction: t }
            );

            const request = new paypal.orders.OrdersCreateRequest();
            const amount = await convertVNDToUSD(booking.workspace_price);

            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                application_context: {
                    shipping_preference: "NO_SHIPPING",
                    return_url: "http://localhost:5500/frontend/",
                },
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: amount,
                            breakdown: {
                                item_total: {
                                    currency_code: "USD",
                                    value: amount,
                                },
                            },
                        },
                        reference_id: booking.booking_id,
                        description: `Booking ID: ${booking.booking_id}`,
                        items: [
                            {
                                name: booking.Workspace.workspace_name,
                                quantity: 1,
                                unit_amount: {
                                    currency_code: "USD",
                                    value: amount,
                                },
                            },
                        ],
                    },
                ],
            });

            const response = await client.execute(request);

            if (response.statusCode !== 201) {
                reject(
                    `Failed to create PayPal order: ${JSON.stringify(
                        response.result
                    )}`
                );
            }

            const order = response.result;

            await db.Payment.update(
                { paypal_order_id: order.id },
                { where: { payment_id: payment.payment_id }, transaction: t }
            );

            await t.commit();

            return resolve({
                err: 0,
                message: "PayPal checkout initiated successfully",
                data: {
                    approval_url: order.links.find(
                        (link) => link.rel === "approve"
                    ).href,
                    order_id: order.id,
                },
            });
        } catch (err) {
            await t.rollback();
            console.error(err);
            return reject(err);
        }
    });

export const paypalSuccessService = ({ booking_id, order_id }) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const booking = await db.Booking.findOne({
                where: { booking_id: booking_id },
            });

            if (!booking) return reject("Booking not found");

            const amount = await convertVNDToUSD(booking.workspace_price);
            const request = new paypal.orders.OrdersCaptureRequest(order_id);
            request.requestBody({
                amount: {
                    currency_code: "USD",
                    value: amount,
                },
            });

            const response = await client.execute(request);

            console.log(response);

            if (response.statusCode !== 201) {
                return reject("Failed to capture PayPal order");
            }

            const payment = await db.Payment.findOne({
                where: { paypal_order_id: order_id },
            });

            if (!payment) return reject("Payment not found");

            const transaction = await db.Transaction.create(
                {
                    payment_id: payment.payment_id,
                    status: "Completed",
                },
                { transaction: t }
            );

            if (!transaction) return reject("Transaction not found");

            await db.BookingStatus.create(
                {
                    booking_id: booking_id,
                    status: "paid",
                },
                { transaction: t }
            );

            await t.commit();

            return resolve({
                err: 0,
                message: "Payment successful",
            });
        } catch (err) {
            await t.rollback();
            console.error(err);
            return reject(err);
        }
    });
