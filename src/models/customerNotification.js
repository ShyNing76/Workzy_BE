"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class CustomerNotification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            CustomerNotification.hasMany(models.Customer, {
                foreignKey: "customer_id",
            });
            CustomerNotification.hasMany(models.Notification, {
                foreignKey: "notification_id",
            });
        }
    }

    CustomerNotification.init(
        {
            customer_notification_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            notification_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "CustomerNotification",
            tableName: "CustomerNotification",
            timestamps: true,
            underscored: true,
        }
    );

    return CustomerNotification;
};
