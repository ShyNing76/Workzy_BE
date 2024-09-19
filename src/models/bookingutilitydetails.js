'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BookingUtilityDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BookingUtilityDetails.belongsTo(models.Booking, {foreignKey: 'booking_id'});
            BookingUtilityDetails.belongsTo(models.Utility, {foreignKey: 'utility_id'});
        }
    }

    BookingUtilityDetails.init({
        booking_utility_id: {
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
        utility_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Utility',
                key: 'utility_id'
            }
        }
    }, {
        sequelize,
        modelName: 'BookingUtilityDetails',
        tableName: 'BookingUtilityDetails',
        timestamps: true,
        underscored: true
    });

    return BookingUtilityDetails;
};
