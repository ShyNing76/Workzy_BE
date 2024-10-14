"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BookingAmenities extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingAmenities.hasMany(models.Booking, {
                foreignKey: "booking_id",
            });
            BookingAmenities.hasMany(models.Amenity, {
                foreignKey: "amenity_id",
                sourceKey: "amenity_id",
            });
        }
    }

    BookingAmenities.init(
        {
            booking_amenities_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: false,
            },
            amenity_id: {
                type: DataTypes.UUID,
                allowNull: false,
                unique: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.0,
            },
            total_price: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.0,
            },
        },
        {
            sequelize,
            modelName: "BookingAmenities",
            tableName: "BookingAmenities",
            timestamps: true,
            underscored: true,
        }
    );

    return BookingAmenities;
};
