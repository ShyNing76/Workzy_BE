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
            Notification.belongsToMany(models.Customer, {
                through: "CustomerNotification",
                foreignKey: "notification_id",
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
            description: {
                type: DataTypes.TEXT,
                defaultValue: false,
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
