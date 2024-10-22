"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Notification extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Notification.belongsTo(models.Customer, {
                through: "Customer",
                foreignKey: "customer_id",
            });
        }
    }

    Notification.init(
        {
            notification_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM("booking", "payment", "system"),
                defaultValue: "system",
            },
            description: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
        },
        {
            sequelize,
            modelName: "Notification",
            tableName: "Notification",
            timestamps: true,
            underscored: true,
        }
    );

    return Notification;
};
