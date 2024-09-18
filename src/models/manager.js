'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Manager = sequelize.define('Manager', {
        manager_id: {
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
        }
    }, {
        tableName: 'Manager',
        timestamps: true,
        underscored: true
    });

    Manager.associate = (models) => {
        Manager.belongsTo(models.Account, {foreignKey: 'manager_id'});
    };

    return Manager;
};
