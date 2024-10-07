import db from "../../models";

export const checkRoomAvailability = async ({
    workspace_id,
    start_time,
    end_time,
}) => {
    try {
        const checkBookingStatus = await db.Booking.findOne({
            where: {
                workspace_id,
                start_time_date: {
                    [db.Sequelize.Op.lt]: end_time,
                },
                end_time_date: {
                    [db.Sequelize.Op.gt]: start_time,
                },
            },
            include: [
                {
                    model: db.BookingStatus,
                    as: "BookingStatuses",
                    where: {
                        status: "confirmed",
                    },
                },
            ],
            raw: true,
        });

        if (checkBookingStatus) {
            return false; // Room is not available
        }
        return true; // Room is available
    } catch (error) {
        console.error(error);
        return false; // Return false in case of error
    }
};
