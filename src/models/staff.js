"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Staff.belongsTo(models.User, { foreignKey: "user_id" });
      Staff.belongsTo(models.Building, { foreignKey: "building_id" });
    }
  }

  Staff.init(
    {
      staff_id: {
        type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      building_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      date_of_birth: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: "Staff",
      tableName: "Staff",
      timestamps: true,
      underscored: true,
    }
  );

  return Staff;
};
