"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Payment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Payment.belongsTo(models.Booking, { foreignKey: "booking_id" });
            Payment.hasMany(models.Transaction, { foreignKey: "payment_id" });
        }
    }

    Payment.init(
        {
            payment_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            payment_method: {
                type: DataTypes.ENUM("paypal", "card"),
                defaultValue: "card",
            },
            payment_date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            payment_type: {
                type: DataTypes.ENUM("Workspace-Price", "Full", "Refund"),
                defaultValue: "Workspace-Price",
            },
            paypal_order_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            paypal_capture_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: "Payment",
            tableName: "Payment",
            timestamps: true,
            underscored: true,
        }
    );

    return Payment;
};
