import paypal from "@paypal/checkout-server-sdk";
import axios from "axios";
import client from "../../config/paypal.config.js";
import db from "../../models/index.js";
import { Op } from "sequelize";
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

            let payment = await db.Payment.findOne({
                where: {
                    booking_id: booking.booking_id,
                    payment_type: "Workspace-Price",
                },
            });

            if (!payment)
                payment = await db.Payment.create(
                    {
                        booking_id: booking.booking_id,
                        amount: booking.total_price,
                        payment_method: "paypal",
                        payment_date: new Date(),
                        payment_type: "Workspace-Price",
                    },
                    { transaction: t }
                );

            let transaction = await db.Transaction.findOne({
                where: {
                    payment_id: payment.payment_id,
                },
            });

            if (!transaction)
                transaction = await db.Transaction.create(
                    {
                        payment_id: payment.payment_id,
                        status: "In-processing",
                    },
                    { transaction: t }
                );

            const request = new paypal.orders.OrdersCreateRequest();
            const amount = await convertVNDToUSD(booking.total_price);

            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                application_context: {
                    shipping_preference: "NO_SHIPPING",
                    return_url: "http://localhost:5173/booking/payment",
                    cancel_url: "http://localhost:5173/",
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
                where: { booking_id },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                    },
                ],
            });

            if (!booking) {
                return reject("Booking not found");
            }

            if (
                !booking.BookingStatuses ||
                booking.BookingStatuses.length === 0
            ) {
                return reject("Booking status not found");
            }

            const latestStatus = booking.BookingStatuses[0].status;

            if (!["confirmed", "cancelled", "paid"].includes(latestStatus)) {
                return reject(`Invalid booking status: ${latestStatus}`);
            }

            if (latestStatus === "cancelled") {
                return reject("Booking has been cancelled");
            }

            if (latestStatus === "paid") {
                return reject("Booking has already been paid");
            }

            if (latestStatus !== "confirmed") {
                return reject(`Unexpected booking status: ${latestStatus}`);
            }

            const amount = await convertVNDToUSD(booking.total_price);
            const request = new paypal.orders.OrdersCaptureRequest(order_id);
            request.requestBody({
                amount: {
                    currency_code: "USD",
                    value: amount,
                },
            });

            const response = await client.execute(request);

            if (response.statusCode !== 201) {
                return reject("Failed to capture PayPal order");
            }

            const payment = await db.Payment.findOne({
                where: { paypal_order_id: order_id },
            });

            if (!payment) return reject("Payment not found");

            console.log(response.result);
            const captureId =
                response.result.purchase_units[0].payments.captures[0].id;

            await db.Payment.update(
                { paypal_capture_id: captureId },
                { where: { payment_id: payment.payment_id } }
            );

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

export const refundBookingService = ({ booking_id, user_id }) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const customer = await db.Customer.findOne({
                where: { user_id },
            });

            if (!customer) return reject("Customer not found");

            const booking = await db.Booking.findOne({
                where: { booking_id, customer_id: customer.customer_id },
            });

            if (!booking) return reject("Booking not found");

            const payment = await db.Payment.findOne({
                where: { booking_id },
                raw: true,
            });

            if (!payment) return reject("Payment not found");

            console.log(payment);

            const transaction = await db.Transaction.findOne({
                where: { payment_id: payment.payment_id },
                order: [["createdAt", "DESC"]],
                raw: true,
            });

            if (!transaction) return reject("Transaction not found");

            if (transaction.status !== "Completed")
                return reject("Transaction not completed");

            const amount = await convertVNDToUSD(booking.total_price);

            const refundRequest = new paypal.payments.CapturesRefundRequest(
                payment.paypal_capture_id
            );
            refundRequest.requestBody({
                amount: {
                    currency_code: "USD",
                    value: amount.toString(),
                },
            });

            const response = await client
                .execute(refundRequest)
                .catch((error) => error);

            console.log(response);

            if (response.statusCode !== 201 && response.statusCode !== 422) {
                return reject("Failed to refund PayPal order");
            }

            await db.Transaction.create(
                {
                    payment_id: payment.payment_id,
                    status: "Refunded",
                },
                { transaction: t }
            );

            await db.BookingStatus.create(
                {
                    booking_id: booking_id,
                    status: "cancelled",
                },
                { transaction: t }
            );

            await t.commit();

            return resolve({
                err: 0,
                message: "Refund successful",
            });
        } catch (err) {
            await t.rollback();
            console.error(err);
            return reject(err);
        }
    });

// Amenities Booking
export const paypalCheckoutAmenitiesService = ({ booking_id, user_id }) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            
            const customer = await db.Customer.findOne({
                where: {
                    user_id: user_id,
                },
            });

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
                        model: db.BookingType,
                        as: "BookingType",
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "booking_type_id",
                            ],
                        },
                        required: true,
                    },
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                        attributes: {
                            exclude: [
                                "createdAt",
                                "updatedAt",
                                "booking_status_id",
                                "booking_id",
                            ],
                        },
                        required: true,
                    },
                ],
            });

            const bookingAmenities = await db.BookingAmenities.findAll({
                where: {
                    booking_id: booking.booking_id,
                },
                attributes: ["amenity_id", "quantity", "price"],
                include: [
                    {
                        model: db.Amenity,
                        attributes: ["amenity_name"],
                        required: true,
                    }
                ]
            });
            const amenitiesId = bookingAmenities.map(amenity => amenity.amenity_id);
            
            const amenities = await db.Amenity.findAll({
                where: {
                    amenity_id: {[Op.in]: amenitiesId},
                },
                attributes: ["amenity_name"],
            });

            if (!customer || !booking) return reject(!customer ? "Customer not found" : "Booking not found");
            if (booking.BookingStatuses[0].status !== "in-process")
                return reject("Booking must be in-process");
            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking already cancelled");

            const [payment, created] = await db.Payment.findOrCreate({
                where: {
                    booking_id: booking.booking_id,
                    payment_type: "Amenities-Price",
                },
                defaults: {
                    booking_id: booking.booking_id,
                    amount: booking.total_amenities_price,
                    payment_method: "paypal",
                    payment_date: new Date(),
                    payment_type: "Amenities-Price",
                }, 
                transaction: t
            });
            if(!created) return reject("Payment already exists");

            const [transaction, createdTransaction] = await db.Transaction.findOrCreate({
                where: {
                    payment_id: payment.payment_id,
                },
                defaults: {
                    payment_id: payment.payment_id,
                    status: "In-processing",
                },
                transaction: t
            });

            if(!createdTransaction) return reject("Transaction not found");

            const request = new paypal.orders.OrdersCreateRequest();
            const amount = await convertVNDToUSD(booking.total_amenities_price);
            const amenitiesNames = amenities.map(amenity => amenity.amenity_name);
            const itemsPromises = bookingAmenities.map(async (amenity, index) => {
                const convertedValue = await convertVNDToUSD(amenity.price * amenity.quantity);
                return {
                    name: amenitiesNames[index],
                    quantity: amenity.quantity,
                    unit_amount: {
                        currency_code: "USD",
                        value: convertedValue,
                    },
                };
            });
            
            const items = await Promise.all(itemsPromises);
            console.log(items);
            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                application_context: {
                    shipping_preference: "NO_SHIPPING",
                    return_url: "http://localhost:5173/booking/payment",
                    cancel_url: "http://localhost:5173/",
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
                        items: items
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

export const paypalAmenitiesSuccessService = ({ booking_id, order_id }) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const booking = await db.Booking.findOne({
                where: { booking_id },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                    },
                ],
            });

            if (!booking) {
                return reject("Booking not found");
            }

            if (
                !booking.BookingStatuses ||
                booking.BookingStatuses.length === 0
            ) {
                return reject("Booking status not found");
            }

            if(booking.BookingStatuses[0].status !== "in-process") return reject("Booking must be in-process");

            if(booking.BookingStatuses[0].status === "cancelled") return reject("Booking already cancelled");

            const amount = await convertVNDToUSD(booking.total_amenities_price);
            const request = new paypal.orders.OrdersCaptureRequest(order_id);
            request.requestBody({
                amount: {
                    currency_code: "USD",
                    value: amount,
                },
            });

            const response = await client.execute(request);

            if (response.statusCode !== 201) {
                return reject("Failed to capture PayPal order");
            }

            const payment = await db.Payment.findOne({
                where: { paypal_order_id: order_id },
            });

            if (!payment) return reject("Payment not found");

            console.log(response.result);
            const captureId =
                response.result.purchase_units[0].payments.captures[0].id;

            await db.Payment.update(
                { paypal_capture_id: captureId },
                { where: { payment_id: payment.payment_id }, transaction: t }
            );

            const transaction = await db.Transaction.create(
                {
                    payment_id: payment.payment_id,
                    status: "Completed",
                },
                { transaction: t }
            );

            if (!transaction) return reject("Transaction created failed");

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
