'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Building extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Building.belongsTo(models.Manager, {foreignKey: 'manager_id'});
            Building.hasMany(models.Workspace, {foreignKey: 'building_id'});
        }
    }

    Building.init({
        building_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Manager',
                key: 'manager_id'
            }
        }
    }, {
        sequelize,
        modelName: 'Building',
        tableName: 'Building',
        timestamps: true,
        underscored: true
    });

    return Building;
};
