"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BookingDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingDetails.belongsTo(models.Booking, {foreignKey: "booking_id"});
        }
    }

    BookingDetails.init(
        {
            BookingDetails_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            price_type: {
                type: DataTypes.ENUM(
                    "workspace_price",
                    "service_price",
                    "broken_price"
                ),
                defaultValue: "workspace_price",
            },
        },
        {
            sequelize,
            modelName: "BookingDetails",
            tableName: "BookingDetails",
            timestamps: true,
            underscored: true,
        }
    );

    return BookingDetails;
};
