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
        primaryKey: true,
      },
      booking_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      payment_method: {
        type: DataTypes.ENUM("paypal", "card"),
        allowNull: false,
      },
      payment_date: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      payment_type: {
        type: DataTypes.ENUM("workspace-price", "full", "refund"),
        defaultValue: "workspace-price",
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
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
