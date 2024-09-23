"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Amenity extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Amenity.belongsToMany(models.Workspace, {
                through: "AmenitiesWorkspace",
                foreignKey: "amenity_id",
            });
        }
    }

    Amenity.init(
        {
            amenity_id: {
                type: DataTypes.UUID,
                primaryKey: true,
            },
            amenity_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            original_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            depreciation_price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                allowNull: false,
                defaultValue: "active",
            },
        },
        {
            sequelize,
            modelName: "Amenity",
            tableName: "Amenity",
            timestamps: true,
            underscored: true,
        }
    );

    return Amenity;
};
