'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
        payment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        payment_method: {
            type: DataTypes.ENUM('paypal', 'card'),
            allowNull: false
        },
        payment_date: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        payment_type: {
            type: DataTypes.ENUM('workspace-price', 'full', 'refund'),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'Payment',
        timestamps: true,
        underscored: true
    });

    Payment.associate = (models) => {
        Payment.hasMany(models.Booking, {foreignKey: 'payment_id'});
    };

    return Payment;
};
