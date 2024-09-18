'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('Customer', {
        customer_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Account',
                key: 'account_id'
            }
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        gender: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        date_of_birth: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        point: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'Customer',
        timestamps: true,
        underscored: true
    });

    Customer.associate = (models) => {
        Customer.belongsTo(models.Account, {foreignKey: 'customer_id'});
    };

    return Customer;
};
