"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BookingStatus extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingStatus.belongsTo(models.Booking, {foreignKey: "booking_id"});
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
                    "paid",
                    "check-in",
                    "in-process",
                    "check-out",
                    "check-amenities",
                    "completed",
                    "cancelled"
                ),
                defaultValue: "paid",
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
