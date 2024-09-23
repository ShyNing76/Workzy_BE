"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Booking.belongsTo(models.Customer, {foreignKey: "customer_id"});
            Booking.belongsToMany(models.TimeSlot, {
                through: "BookingTimeSlotDetails",
                foreignKey: "booking_id",
            });
            Booking.belongsToMany(models.Service, {
                through: "BookingServiceDetails",
                foreignKey: "booking_id",
            });
            Booking.hasOne(models.Review, {foreignKey: "booking_id"});
            Booking.hasMany(models.BookingStatus, {foreignKey: "booking_id"});
            Booking.hasMany(models.Payment, {foreignKey: "booking_id"});
            Booking.belongsTo(models.Workspace, {foreignKey: "workspace_id"});
        }
    }

    Booking.init(
        {
            booking_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            workspace_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            booking_date: {
                type: DataTypes.DATE,
                defaultValue: null,
            },
            workspace_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            service_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            broken_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Booking",
            tableName: "Booking",
            timestamps: true,
            underscored: true,
        }
    );

    return Booking;
};
