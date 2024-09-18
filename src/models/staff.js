'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        staff_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Account',
                key: 'account_id'
            }
        },
        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        building_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Building',
                key: 'building_id'
            }
        }
    }, {
        tableName: 'Staff',
        timestamps: true,
        underscored: true
    });

    Staff.associate = (models) => {
        Staff.belongsTo(models.Account, {foreignKey: 'staff_id'});
        Staff.belongsTo(models.Building, {foreignKey: 'building_id'});
    };

    return Staff;
};
