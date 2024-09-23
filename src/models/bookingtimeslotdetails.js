"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BookingTimeSlotDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingTimeSlotDetails.hasMany(models.Booking, {
                foreignKey: "booking_id",
            });
            BookingTimeSlotDetails.hasMany(models.TimeSlot, {
                foreignKey: "time_slot_id",
            });
        }
    }

    BookingTimeSlotDetails.init(
        {
            booking_time_slot_id: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false
            },
            time_slot_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "BookingTimeSlotDetails",
            tableName: "BookingTimeSlotDetails",
            timestamps: true,
            underscored: true,
        }
    );

    return BookingTimeSlotDetails;
};
