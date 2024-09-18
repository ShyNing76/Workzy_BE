'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Building = sequelize.define('Building', {
        building_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        building_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        amenities: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        workspace_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: null
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        manager_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Manager',
                key: 'manager_id'
            }
        }
    }, {
        tableName: 'Building',
        timestamps: true,
        underscored: true
    });

    Building.associate = (models) => {
        Building.belongsTo(models.Manager, {foreignKey: 'manager_id'});
        Building.hasMany(models.Workspace, {foreignKey: 'building_id'});
    };

    return Building;
};
