'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Utility extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Utility.hasMany(models.BookingUtilityDetails, {foreignKey: 'utility_id'});
        }
    }

    Utility.init({
        utility_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        utility_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        rent: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        sequelize,
        modelName: 'Utility',
        tableName: 'Utility',
        timestamps: true,
        underscored: true
    });

    return Utility;
};
