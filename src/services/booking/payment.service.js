import paypal from "@paypal/checkout-server-sdk";
import axios from "axios";
import { Op } from "sequelize";
import client from "../../config/paypal.config.js";
import db from "../../models/index.js";
import { sendMail } from "../../utils/sendMail/index.js";
import { v4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

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

            const status = [
                "paid",
                "in-process",
                "check-out",
                "check-amenities",
                "completed",
                "cancelled",
            ];

            if (status.includes(booking.BookingStatuses[0].status))
                return reject("Invalid booking status");

            const [payment, created] = await db.Payment.findOrCreate({
                where: {
                    booking_id: booking.booking_id,
                    payment_type: "Workspace-Price",
                },
                defaults: {
                    booking_id: booking.booking_id,
                    amount: booking.total_price,
                    payment_method: "paypal",
                    payment_date: new Date(),
                    payment_type: "Workspace-Price",
                },
                transaction: t,
            });
            if (!created) return reject("Payment created failed");

            const [transaction, createdTransaction] =
                await db.Transaction.findOrCreate({
                    where: { payment_id: payment.payment_id },
                    defaults: {
                        payment_id: payment.payment_id,
                        status: "In-processing",
                    },
                    transaction: t,
                });

            if (!createdTransaction) return reject("Transaction not found");

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
                    {
                        model: db.Customer,
                        as: "Customer",
                        attributes: ["customer_id", "user_id", "point"],
                        include: [
                            {
                                model: db.User,
                                as: "User",
                                attributes: ["email", "name"],
                            },
                        ],
                    },
                    {
                        model: db.Workspace,
                        as: "Workspace",
                        attributes: ["workspace_name"],
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

            const amount = await convertVNDToUSD(booking.total_workspace_price);
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
            const updatedPoints = await db.Customer.update(
                {
                    point:
                        parseInt(booking.Customer.point) +
                        Math.ceil(
                            parseInt(booking.total_workspace_price) / 1000
                        ),
                },
                {
                    where: {
                        customer_id: booking.Customer.customer_id,
                    },
                    transaction: t,
                }
            );
            if (updatedPoints[0] === 0)
                return reject("Failed to update customer points");
            await sendMail(
                booking.Customer.User.email,
                "Booking Payment Successful",
                `
                    <h1>Booking Payment Successful</h1>
                    <p>Dear ${booking.Customer.User.name},</p>
                    <p>Your booking has been confirmed with the following details:</p>
                    <ul>
                        <li>Booking ID: ${booking.booking_id}</li>
                        <li>Workspace: ${booking.Workspace.workspace_name}</li>
                        <li>Start Time: ${new Date(
                            booking.start_time
                        ).toLocaleString()}</li>
                        <li>End Time: ${new Date(
                            booking.end_time
                        ).toLocaleString()}</li>
                        <li>Total Price: $${booking.total_price}</li>
                    </ul>
                    <p>Thank you for choosing our service!</p>
                `
            );
            await t.commit();

            return resolve({
                err: 0,
                message: "Payment successfully",
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
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                    },
                ],
            });

            if (!booking) return reject("Booking not found");

            if (booking.BookingStatuses[0].status !== "paid")
                return reject("Booking must be paid");

            // if booking is cancelled within 24 hours, do not refund
            if (
                booking.BookingStatuses[0].createdAt <
                new Date(new Date().setDate(new Date().getDate() - 1))
            ) {
                const bookingStatus = await db.BookingStatus.create(
                    {
                        booking_id: booking_id,
                        status: "cancelled",
                    },
                    { transaction: t }
                );
                if (!bookingStatus) return reject("Booking status not found");

                await t.commit();
                return resolve({
                    err: 0,
                    message:
                        "Booking is cancelled within 24 hours, do not refund",
                });
            }

            const payment = await db.Payment.findOne({
                where: { booking_id },
                raw: true,
            });

            if (!payment) return reject("Payment not found");

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
export const paypalCheckoutAmenitiesService = ({
    booking_id,
    user_id,
    addAmenities,
    total_amenities_price,
}) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            // Check if customer and booking exist
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
            if (!customer || !booking)
                return reject(
                    !customer ? "Customer not found" : "Booking not found"
                );

            // Check if booking is in-process and not cancelled
            if (booking.BookingStatuses[0].status !== "in-process")
                return reject("Booking must be in-process");
            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking already cancelled");

            const amenitiesId = addAmenities.map(
                (amenity) => amenity.amenity_id
            );
            const quantities = addAmenities.map((amenity) => amenity.quantity);

            // Check if all amenities are valid
            const amenities = await db.Amenity.findAll({
                where: {
                    amenity_id: { [Op.in]: amenitiesId },
                    status: "active",
                },
                attributes: ["amenity_name", "rent_price", "amenity_id"],
            });
            if (amenities.length === 0)
                return reject("No valid amenities found");

            // Calculate the total amount for all items correctly
            const totalAmenitiesPrice = amenities.reduce(
                (total, amenity, index) => {
                    return total + amenity.rent_price * quantities[index];
                },
                0
            );
            if (total_amenities_price !== totalAmenitiesPrice)
                return reject("Total amenities price mismatch");

            // Create payment
            const payment = await db.Payment.create(
                {
                    booking_id: booking.booking_id,
                    amount: total_amenities_price,
                    payment_method: "paypal",
                    payment_date: new Date(),
                    payment_type: "Amenities-Price",
                },
                {
                    transaction: t,
                }
            );
            if (!payment) return reject("Payment created failed");

            // Create transaction
            const transaction = await db.Transaction.create(
                {
                    payment_id: payment.payment_id,
                    status: "In-processing",
                },
                {
                    transaction: t,
                }
            );
            if (!transaction) return reject("Transaction created failed");

            const request = new paypal.orders.OrdersCreateRequest();
            const amount = await convertVNDToUSD(total_amenities_price);

            // Calculate the total amount for all items correctly
            const itemsPromises = amenities.map(async (amenity, index) => {
                const convertedValue = await convertVNDToUSD(
                    amenity.rent_price
                );
                const convertedTotal = await convertVNDToUSD(
                    amenity.rent_price * quantities[index]
                );
                return {
                    name: amenity.amenity_name,
                    quantity: quantities[index],
                    unit_amount: {
                        currency_code: "USD",
                        value: convertedValue,
                    },
                    total: convertedTotal,
                };
            });
            const items = await Promise.all(itemsPromises);

            // Create PayPal order
            request.prefer("return=representation");
            request.requestBody({
                intent: "CAPTURE",
                application_context: {
                    shipping_preference: "NO_SHIPPING",
                    return_url: process.env.PAYPAL_RETURN_URL,
                    cancel_url: process.env.PAYPAL_CANCEL_URL,
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
                        items: items,
                    },
                ],
            });

            // Execute the request
            const response = await client.execute(request);

            // Check if the request is successful
            if (response.statusCode !== 201) {
                reject(
                    `Failed to create PayPal order: ${JSON.stringify(
                        response.result
                    )}`
                );
            }

            // Update payment with PayPal order ID
            const order = response.result;
            await db.Payment.update(
                { paypal_order_id: order.id },
                { where: { payment_id: payment.payment_id }, transaction: t }
            );
            // Create booking amenities
            const bookingAmenities = amenities.map((amenity, index) => {
                const quantity = quantities[index];
                const bookingAmenity = {
                    booking_amenities_id: v4(),
                    booking_id: booking.booking_id,
                    amenity_id: amenity.amenity_id,
                    quantity: quantity,
                    price: amenity.rent_price,
                    total_price: amenity.rent_price * quantity,
                };
                return db.BookingAmenities.create(bookingAmenity, {
                    transaction: t,
                });
            });
            await Promise.all(bookingAmenities);

            // Update booking with total amenities price
            booking.total_amenities_price = parseInt(total_amenities_price);
            await booking.save({ transaction: t });

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
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                        required: true,
                    },
                    {
                        model: db.Customer,
                        attributes: ["user_id", "point", "customer_id"],
                        required: true,
                        include: [
                            {
                                model: db.User,
                                attributes: ["email"],
                                required: true,
                            },
                        ],
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

            if (booking.BookingStatuses[0].status !== "in-process")
                return reject("Booking must be in-process");

            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking already cancelled");

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

            booking.total_price =
                parseInt(booking.total_price) +
                parseInt(booking.total_amenities_price);
            await booking.save({ transaction: t });
            const updatedPoints = await db.Customer.update(
                {
                    point:
                        parseInt(booking.Customer.point) +
                        Math.ceil(
                            parseInt(booking.total_workspace_price) / 1000
                        ),
                },
                {
                    where: {
                        customer_id: booking.Customer.customer_id,
                    },
                    transaction: t,
                }
            );
            if (updatedPoints[0] === 0)
                return reject("Failed to update customer points");
            await sendMail(
                booking.Customer.User.email,
                "Payment successful",
                "Thank you for your payment. Enjoy your workspace."
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

// Amenities damage payment
export const paypalCheckoutDamageService = ({ booking_id, user_id }) =>
    new Promise(async (resolve, reject) => {
        const t = await db.sequelize.transaction();
        try {
            const customer = await db.Customer.findOne({
                where: { user_id },
            });

            if (!customer) return reject("Customer not found");

            const booking = await db.Booking.findOne({
                where: { booking_id },
                include: [
                    {
                        model: db.BookingStatus,
                        as: "BookingStatuses",
                        order: [["createdAt", "DESC"]],
                        limit: 1,
                    },
                    {
                        model: db.Customer,
                        as: "Customer",
                        attributes: ["customer_id", "point"],
                        include: [
                            {
                                model: db.User,
                                as: "User",
                                attributes: ["email", "name"],
                            },
                        ],
                    },
                ],
            });

            if (!booking) return reject("Booking not found");

            if (booking.BookingStatuses[0].status !== "damaged-payment")
                return reject("Booking is not damaged-payment");

            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking already cancelled");

            const [payment, created] = await db.Payment.findOrCreate({
                where: {
                    booking_id: booking.booking_id,
                    payment_type: "Broken-Price",
                },
                defaults: {
                    booking_id: booking.booking_id,
                    amount: booking.total_price,
                    payment_method: "paypal",
                    payment_date: new Date(),
                    payment_type: "Broken-Price",
                },
                transaction: t,
            });
            if (!created) return reject("Payment created failed");

            const [transaction, createdTransaction] =
                await db.Transaction.findOrCreate({
                    where: { payment_id: payment.payment_id },
                    defaults: {
                        payment_id: payment.payment_id,
                        status: "In-processing",
                    },
                    transaction: t,
                });

            if (!createdTransaction)
                return reject("Transaction created failed");
            const amount = await convertVNDToUSD(booking.total_broken_price);
            const request = new paypal.orders.OrdersCreateRequest();

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
                        reference_id: booking_id,
                        description: `Booking ID: ${booking_id}`,
                        items: [
                            {
                                name: "Damage Payment",
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
                return reject(
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
            resolve({
                err: 0,
                message: "PayPal checkout initiated successfully",
                data: {
                    approval_url: response.result.links.find(
                        (link) => link.rel === "approve"
                    ).href,
                    order_id: response.result.id,
                },
            });
        } catch (err) {
            await t.rollback();
            console.error(err);
            return reject(err);
        }
    });

export const paypalDamageSuccessService = ({ booking_id, order_id }) =>
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
                        require: true,
                    },
                    {
                        model: db.Customer,
                        as: "Customer",
                        attributes: ["user_id", "point"],
                        require: true,
                        include: [
                            {
                                model: db.User,
                                as: "User",
                                attributes: ["email", "name"],
                            },
                        ],
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

            if (booking.BookingStatuses[0].status !== "damaged-payment")
                return reject("Booking must be damaged-payment");

            if (booking.BookingStatuses[0].status === "cancelled")
                return reject("Booking already cancelled");

            const amount = await convertVNDToUSD(booking.total_broken_price);
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

            const captureId =
                response.result.purchase_units[0].payments.captures[0].id;

            const updatedPayment = await db.Payment.update(
                { paypal_capture_id: captureId },
                { where: { payment_id: payment.payment_id }, transaction: t }
            );
            if (updatedPayment[0] === 0) return reject("Payment not found");

            const transaction = await db.Transaction.create(
                {
                    payment_id: payment.payment_id,
                    status: "Completed",
                },
                { transaction: t }
            );

            if (!transaction) return reject("Transaction created failed");

            const changeBookingStatus = await db.BookingStatus.create(
                {
                    booking_id: booking_id,
                    status: "completed",
                },
                { transaction: t }
            );
            if (!changeBookingStatus)
                return reject("Booking Status changed failed");

            booking.total_price =
                parseInt(booking.total_price) +
                parseInt(booking.total_broken_price);
            await booking.save({ transaction: t });

            await sendMail(
                booking.Customer.User.email,
                "Payment successful",
                "Thank you for using the service at Workzy."
            );

            await t.commit();
            resolve({
                err: 0,
                message: "Payment successful",
            });
        } catch (err) {
            await t.rollback();
            console.error(err);
            return reject(err);
        }
    });
