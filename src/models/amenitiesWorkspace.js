"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class AmenitiesWorkspace extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            AmenitiesWorkspace.hasMany(models.Workspace, {
                foreignKey: "workspace_id",
                sourceKey: "workspace_id"
            });
            AmenitiesWorkspace.hasMany(models.Amenity, {
                foreignKey: "amenity_id",
                sourceKey: "amenity_id"
            });
        }
    }

    AmenitiesWorkspace.init(
        {
            amenities_workspace_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            workspace_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            amenity_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            }
        },
        {
            sequelize,
            modelName: "AmenitiesWorkspace",
            tableName: "AmenitiesWorkspace",
            timestamps: true,
            underscored: true,
        }
    );

    return AmenitiesWorkspace;
};
