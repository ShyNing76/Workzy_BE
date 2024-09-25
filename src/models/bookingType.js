"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BookingType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingType.hasMany(models.Booking, {
                foreignKey: "booking_id",
            });
        }
    }

    BookingType.init(
        {
            booking_type_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            type:{
                type: DataTypes.ENUM("hourly", "daily", "monthly"),
                defaultValue: "hourly",
            }
        },
        {
            sequelize,
            modelName: "BookingType",
            tableName: "BookingType",
            timestamps: true,
            underscored: true,
        }
    );

    return BookingType;
};
