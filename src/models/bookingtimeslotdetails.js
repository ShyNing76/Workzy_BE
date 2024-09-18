'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const BookingTimeSlotDetails = sequelize.define('BookingTimeSlotDetails', {
        booking_time_slot_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        booking_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Booking',
                key: 'booking_id'
            }
        },
        time_slot_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'TimeSlot',
                key: 'time_slot_id'
            }
        }
    }, {
        tableName: 'booking_time_slot_details',
        timestamps: true,
        underscored: true
    });

    BookingTimeSlotDetails.associate = (models) => {
        BookingTimeSlotDetails.belongsTo(models.Booking, {foreignKey: 'booking_id'});
        BookingTimeSlotDetails.belongsTo(models.TimeSlot, {foreignKey: 'time_slot_id'});
    };

    return BookingTimeSlotDetails;
};
