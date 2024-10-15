"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BookingStatus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingStatus.belongsTo(models.Booking, {
                foreignKey: "booking_id",
            });
        }
    }

    BookingStatus.init(
        {
            booking_status_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(
                    "confirmed", // customer
                    "paid", // customer
                    "check-in", // staff
                    "in-process", // customer
                    "check-out", // staff
                    "check-amenities", // staff (chọn amenities bị hư thông model)
                    "completed", // 1
                    "damaged-payment", // 1 customer
                    "cancelled"
                ),
                defaultValue: "confirmed",
            },
        },
        {
            sequelize,
            modelName: "BookingStatus",
            tableName: "BookingStatus",
            timestamps: true,
            underscored: true,
        }
    );

    return BookingStatus;
};
