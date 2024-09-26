"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            User.hasOne(models.Manager, {foreignKey: "user_id"});
            User.hasOne(models.Staff, {foreignKey: "user_id"});
            User.hasOne(models.Customer, {foreignKey: "user_id"});
            User.belongsTo(models.Role, {foreignKey: "role_id"});
        }
    }

    User.init(
        {
            user_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: true,
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
            google_token: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "active",
            },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "User",
            timestamps: true,
            underscored: true,
        }
    );

    return User;
};
