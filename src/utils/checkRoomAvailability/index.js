export const checkRoomAvailability = async ({
    workspace_id,
    start_time,
    end_time,
}) => {
    try {
        const bookingStatues = await db.Booking.findAll({
            attributes: [
                "booking_id",
                "workspace_id",
                "start_time_date",
                "end_time_date",
            ],
            where: {
                workspace_id: workspace_id,
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
                    attributes: [
                        [
                            Sequelize.fn(
                                "ARRAY_AGG",
                                Sequelize.col("BookingStatuses.status")
                            ),
                            "statusArray",
                        ],
                    ],
                },
            ],
            group: [
                "Booking.booking_id",
                "Booking.workspace_id",
                "Booking.start_time_date",
                "Booking.end_time_date",
            ],
            raw: true,
        });

        // Nếu không có booking nào thì trả về true | Nghĩa là phòng đang trống
        if (bookingStatues.length === 0) {
            return true;
        }

        // Nếu tất cả các trạng thái trong statusArray đều là "cancelled" thì trả về true | Nghĩa là phòng đang trống
        const isAvailable = bookingStatues.every((bookingStatus) =>
            bookingStatus.BookingStatuses?.statusArray?.includes("cancelled")
        );
        return isAvailable;
    } catch (error) {
        console.error(error);
        return false; // Return false in case of error
    }
};
