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
            BookingDetails.hasMany(models.Booking, {
                foreignKey: "booking_id",
            });
            BookingDetails.hasMany(models.Workspace, {
                foreignKey: "workspace_id",
            });
        }
    }

    BookingDetails.init(
        {
            booking_details_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            workspace_id: {
                type: DataTypes.UUID,
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
            workspace_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
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
