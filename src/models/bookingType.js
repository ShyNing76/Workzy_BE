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
                foreignKey: "booking_type_id"
            });
        }
    }

    BookingType.init(
        {
            booking_type_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
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
