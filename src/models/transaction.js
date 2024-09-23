"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Transaction extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Transaction.belongsTo(models.Payment, {foreignKey: "payment_id"});
        }
    }

    Transaction.init(
        {
            transaction_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            payment_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("Completed", "In-processing", "Failed"),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Transaction",
            tableName: "Transaction",
            timestamps: true,
            underscored: true,
        }
    );

    return Transaction;
};
