import db from "../../models";

export const getBookingTypesService = () =>
    new Promise(async (resolve, reject) => {
        try {
            const bookingTypes = await db.BookingType.findAll();

            if (!bookingTypes) {
                return reject("Failed to get booking types");
            }

            resolve({
                err: 0,
                message: "Get booking types successfully",
                data: bookingTypes,
            });
        } catch (error) {
            reject(error);
        }
    });
