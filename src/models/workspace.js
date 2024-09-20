'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Workspace extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Workspace.belongsTo(models.Building, {foreignKey: 'building_id'});
            Workspace.hasMany(models.Wishlist, {foreignKey: 'workspace_id'});
            Workspace.hasMany(models.Booking, {foreignKey: 'workspace_id'});
            Workspace.hasMany(models.Review, {foreignKey: 'workspace_id'});
        }
    }

    Workspace.init({
        workspace_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        workspace_name: {
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
        amenities: {
            type: DataTypes.STRING(250),
            allowNull: false
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.00
        },
        building_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Building',
                key: 'building_id'
            }
        },
        price_per_hour: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Workspace',
        tableName: 'Workspace',
        timestamps: true,
        underscored: true
    });

    return Workspace;
};
