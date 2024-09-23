"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            // define association here
            Role.hasMany(models.User, {foreignKey: "role_id"});
        }
    }

    Role.init(
        {
            role_id: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
            },
            role_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "active",
            },
        },
        {
            sequelize,
            modelName: "Role",
            tableName: "Role",
            timestamps: true,
            underscored: true,
        }
    );

    return Role;
};
