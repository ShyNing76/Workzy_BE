"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Voucher extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Voucher.hasMany(models.Booking, { foreignKey: "voucher_id" });
        }
    }

    Voucher.init(
        {
            voucher_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            voucher_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            voucher_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            decription: {
                type: DataTypes.STRING,
                defaultValue: "",
            },
            discount: {
                type: DataTypes.FLOAT,
                defaultValue: 0.1,
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            expired_date: {
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "inactive",
            },
        },
        {
            sequelize,
            modelName: "Voucher",
            tableName: "Voucher",
            timestamps: true,
            underscored: true,
        }
    );

    return Voucher;
};
