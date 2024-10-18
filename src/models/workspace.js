"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Workspace extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Workspace.belongsTo(models.Building, { foreignKey: "building_id" });
            Workspace.belongsToMany(models.Customer, {
                through: "Wishlist",
                foreignKey: "workspace_id",
            });
            Workspace.hasMany(models.Booking, { foreignKey: "workspace_id" });
            Workspace.belongsToMany(models.Amenity, {
                through: "AmenitiesWorkspace",
                foreignKey: "workspace_id",
            });
            Workspace.belongsTo(models.WorkspaceType, {
                foreignKey: "workspace_type_id",
            });
            Workspace.hasMany(models.WorkspaceImage, {
                foreignKey: "workspace_id",
            });
        }
    }

    Workspace.init(
        {
            workspace_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            workspace_type_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            building_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            workspace_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            price_per_hour: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            price_per_day: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            price_per_month: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            area: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            capacity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            description: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "inactive",
            },
        },
        {
            sequelize,
            modelName: "Workspace",
            tableName: "Workspace",
            timestamps: true,
            underscored: true,
        }
    );

    return Workspace;
};
