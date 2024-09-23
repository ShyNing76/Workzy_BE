"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Customer.belongsTo(models.User, {foreignKey: "user_id"});
            Customer.belongsToMany(models.Workspace, {
                through: "Wishlist",
                foreignKey: "customer_id",
            });
            Customer.belongsToMany(models.Notification, {
                through: "CustomerNotification",
                foreignKey: "customer_id",
            });
            Customer.hasMany(models.Booking, {foreignKey: "customer_id"});
        }
    }

    Customer.init(
        {
            customer_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(15),
                allowNull: false,
            },
            gender: {
                type: DataTypes.STRING,
                defaultValue: null,
            },
            date_of_birth: {
                type: DataTypes.DATE,
                defaultValue: null,
            },
            point: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: "Customer",
            tableName: "Customer",
            timestamps: true,
            underscored: true,
        }
    );

    return Customer;
};
