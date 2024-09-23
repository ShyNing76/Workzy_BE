"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BookingServiceDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingServiceDetails.hasMany(models.Booking, {
                foreignKey: "booking_id",
            });
            BookingServiceDetails.hasMany(models.Service, {
                foreignKey: "service_id",
            });
        }
    }

    BookingServiceDetails.init(
        {
            booking_service_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            service_id: {
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
            modelName: "BookingServiceDetails",
            tableName: "BookingServiceDetails",
            timestamps: true,
            underscored: true,
        }
    );

    return BookingServiceDetails;
};
