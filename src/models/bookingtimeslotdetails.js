'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BookingTimeSlotDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingTimeSlotDetails.belongsTo(models.Booking, {foreignKey: 'booking_id'});
            BookingTimeSlotDetails.belongsTo(models.TimeSlot, {foreignKey: 'time_slot_id'});
        }
    }

    BookingTimeSlotDetails.init({
        booking_time_slot_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        booking_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Booking',
                key: 'booking_id'
            }
        },
        time_slot_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'TimeSlot',
                key: 'time_slot_id'
            }
        }
    }, {
        sequelize,
        modelName: 'BookingTimeSlotDetails',
        tableName: 'booking_time_slot_details',
        timestamps: true,
        underscored: true
    });

    return BookingTimeSlotDetails;
};
