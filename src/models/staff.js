"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Staff extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Staff.belongsTo(models.User, {foreignKey: "user_id"});
            Staff.belongsTo(models.Building, {foreignKey: "building_id"});
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
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "active",
                setStatus(value) {
                    if (value === "active" || value === "inactive") {
                        this.setDataValue("status", value);
                    }
                }
            }
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
