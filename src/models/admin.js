'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        admin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Account',
                key: 'account_id'
            }
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        tableName: 'Admin',
        timestamps: true,
        underscored: true
    });

    Admin.associate = (models) => {
        Admin.belongsTo(models.Account, {foreignKey: 'admin_id'});
    };

    return Admin;
};
