'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Wishlist = sequelize.define('Wishlist', {
        wishlist_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customer_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Customer',
                key: 'customer_id'
            }
        },
        workspace_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Workspace',
                key: 'workspace_id'
            }
        }
    }, {
        tableName: 'Wishlist',
        timestamps: true,
        underscored: true
    });

    Wishlist.associate = (models) => {
        Wishlist.belongsTo(models.Customer, {foreignKey: 'customer_id'});
        Wishlist.belongsTo(models.Workspace, {foreignKey: 'workspace_id'});
    };

    return Wishlist;
};

