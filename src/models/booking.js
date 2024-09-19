'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Booking extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Booking.belongsTo(models.Customer, {foreignKey: 'customer_id'});
            Booking.belongsTo(models.Workspace, {foreignKey: 'workspace_id'});
            Booking.belongsTo(models.Payment, {foreignKey: 'payment_id'});
            Booking.hasMany(models.BookingTimeSlotDetails, {foreignKey: 'booking_id'});
            Booking.hasMany(models.BookingUtilityDetails, {foreignKey: 'booking_id'});
            Booking.hasMany(models.Review, {foreignKey: 'booking_id'});
        }
    }

    Booking.init({
        booking_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        booking_date: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        workspace_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        utility_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        broken_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('approved', 'check-in', 'in-process', 'check-out', 'completed', 'cancelled'),
            allowNull: false
        },
        customer_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Customer',
                key: 'customer_id'
            }
        },
        workspace_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Workspace',
                key: 'workspace_id'
            }
        },
        payment_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Payment',
                key: 'payment_id'
            }
        }
    }, {
        sequelize,
        modelName: 'Booking',
        tableName: 'Booking',
        timestamps: true,
        underscored: true
    });

    return Booking;
};
