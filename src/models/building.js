"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Building extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Building.hasOne(models.Staff, { foreignKey: "building_id" });
      Building.hasMany(models.Workspace, { foreignKey: "building_id" });
      Building.belongsTo(models.Manager, { foreignKey: "manager_id" });
    }
  }

  Building.init(
    {
      building_id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      manager_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      building_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: null,
      },
      status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active",
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
