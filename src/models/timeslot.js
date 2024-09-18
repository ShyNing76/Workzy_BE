'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const TimeSlot = sequelize.define('TimeSlot', {
        time_slot_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        start_time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        end_time: {
            type: DataTypes.TIME,
            allowNull: false
        }
    }, {
        tableName: 'TimeSlot',
        timestamps: true,
        underscored: true
    });

    TimeSlot.associate = (models) => {
        TimeSlot.hasMany(models.BookingTimeSlotDetails, {foreignKey: 'time_slot_id'});
    };

    return TimeSlot;
};
