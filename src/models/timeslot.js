'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class TimeSlot extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            TimeSlot.hasMany(models.BookingTimeSlotDetails, {foreignKey: 'time_slot_id'});
        }
    }

    TimeSlot.init({
        time_slot_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        sequelize,
        modelName: 'TimeSlot',
        tableName: 'TimeSlot',
        timestamps: true,
        underscored: true
    });

    return TimeSlot;
};
