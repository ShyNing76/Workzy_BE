"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Service extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Service.belongsToMany(models.Booking, {
                through: "BookingServiceDetails",
                foreignKey: "service_id",
            });
        }
    }

    Service.init(
        {
            service_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            service_name: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            price: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0.0,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "active",
            },
        },
        {
            sequelize,
            modelName: "Service",
            tableName: "Service",
            timestamps: true,
            underscored: true,
        }
    );

    return Service;
};
