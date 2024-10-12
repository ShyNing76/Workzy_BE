"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Booking.belongsTo(models.Customer, { foreignKey: "customer_id" });
            Booking.belongsToMany(models.Amenity, {
                through: "BookingAmenities",
                foreignKey: "booking_id",
            });
            Booking.belongsTo(models.BookingType, {
                foreignKey: "booking_type_id",
            });
            Booking.belongsTo(models.Workspace, { foreignKey: "workspace_id" });
            Booking.hasOne(models.Review, { foreignKey: "booking_id" });
            Booking.hasMany(models.BookingStatus, { foreignKey: "booking_id" });
            Booking.hasMany(models.Payment, { foreignKey: "booking_id" });
            Booking.belongsTo(models.Voucher, { foreignKey: "voucher_id" });
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
            booking_type_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            voucher_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            workspace_price: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.0,
            },
            total_workspace_price: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.0,
            },
            total_amenities_price: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.0,
            },
            total_broken_price: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.0,
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            start_time_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            end_time_date: {
                type: DataTypes.DATE,
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
