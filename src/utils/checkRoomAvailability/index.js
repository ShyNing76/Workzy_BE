import db from "../../models";

export const checkRoomAvailability = (data) => new Promise(async (resolve, reject) => {
    try {
        const {building_id, room_id, date, start_time, end_time} = data;

        const isAvailable = await db.BookingDetail.findOne({
            where: {
                building_id,
                room_id,
                start_time_date: date,
                end_time_date: date,
                [db.Sequelize.Op.or]: [
                    {
                        [db.Sequelize.Op.and]: [
                            {
                                start_time: {
                                    [db.Sequelize.Op.lte]: start_time
                                }
                            },
                            {
                                end_time: {
                                    [db.Sequelize.Op.gte]: start_time
                                }
                            }
                        ]
                    },
                    {
                        [db.Sequelize.Op.and]: [
                            {
                                start_time: {
                                    [db.Sequelize.Op.lte]: end_time
                                }
                            },
                            {
                                end_time: {
                                    [db.Sequelize.Op.gte]: end_time
                                }
                            }
                        ]
                    },
                    {
                        [db.Sequelize.Op.and]: [
                            {
                                start_time: {
                                    [db.Sequelize.Op.gte]: start_time
                                }
                            },
                            {
                                end_time: {
                                    [db.Sequelize.Op.lte]: end_time
                                }
                            }
                        ]
                    }
                ]
            }
        });

        if (isAvailable) {
            return resolve("Room is not available");
        }

        resolve("Room is available");
    } catch (error) {
        reject(error);
    }
});