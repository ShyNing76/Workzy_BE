"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Define association here
            Admin.belongsTo(models.User, {foreignKey: "user_id"});
        }
    }

    Admin.init(
        {
            admin_id: {
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
        },
        {
            sequelize,
            modelName: "Admin",
            tableName: "Admin",
            timestamps: true,
            underscored: true,
        }
    );

    return Admin;
};
