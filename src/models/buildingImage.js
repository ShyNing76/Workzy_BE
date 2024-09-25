"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class BuildingImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BuildingImage.belongsTo(models.Building, {foreignKey: "building_id"});
        }
    }

    BuildingImage.init(
        {
            building_image_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            building_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "active",
            },
        },
        {
            sequelize,
            modelName: "BuildingImage",
            tableName: "BuildingImage",
            timestamps: true,
            underscored: true,
        }
    );

    return BuildingImage;
};
