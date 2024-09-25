"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Manager extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Manager.belongsTo(models.User, {foreignKey: "user_id"});
            Manager.hasMany(models.Building, {foreignKey: "manager_id"});
        }
    }

    Manager.init(
        {
            manager_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },
            gender: {
                type: DataTypes.ENUM("Male", "Female", "Others"),
                defaultValue: "Male",
            },
            date_of_birth: {
                type: DataTypes.DATE,
                defaultValue: null,
            },
        },
        {
            sequelize,
            modelName: "Manager",
            tableName: "Manager",
            timestamps: true,
            underscored: true,
        }
    );

    return Manager;
};
