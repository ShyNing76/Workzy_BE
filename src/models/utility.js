'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Utility = sequelize.define('Utility', {
        utility_id: {
            type: DataTypes.INTEGER,
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
        tableName: 'Utility',
        timestamps: true,
        underscored: true
    });

    Utility.associate = (models) => {
        Utility.hasMany(models.BookingUtilityDetails, {foreignKey: 'utility_id'});
    };

    return Utility;
};


