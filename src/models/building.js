"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Building extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Building.hasOne(models.Staff, {foreignKey: "building_id"});
            Building.hasMany(models.Workspace, {foreignKey: "building_id"});
            Building.belongsTo(models.Manager, {foreignKey: "manager_id"});
            Building.hasMany(models.BuildingImage, {foreignKey: "building_id"});
        }
    }

    Building.init(
        {
            building_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            manager_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            building_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            location: {
                type: DataTypes.ENUM("Hanoi", "HCM"),
                defaultValue: "Hanoi",
            },
            address: {
                type: DataTypes.STRING(200),
                defaultValue: null,
            },
            description: {
                type: DataTypes.TEXT,
                defaultValue: null,
            },
            rating: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "inactive",
            },
        },
        {
            sequelize,
            modelName: "Building",
            tableName: "Building",
            timestamps: true,
            underscored: true,
        }
    );

    return Building;
};
