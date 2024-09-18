'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const BookingUtilityDetails = sequelize.define('BookingUtilityDetails', {
        booking_utility_id: {
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
        utility_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Utility',
                key: 'utility_id'
            }
        }
    }, {
        tableName: 'BookingUtilityDetails',
        timestamps: true,
        underscored: true
    });

    BookingUtilityDetails.associate = (models) => {
        BookingUtilityDetails.belongsTo(models.Booking, {foreignKey: 'booking_id'});
        BookingUtilityDetails.belongsTo(models.Utility, {foreignKey: 'utility_id'});
    };

    return BookingUtilityDetails;
};
