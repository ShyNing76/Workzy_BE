"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class WorkspaceType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            WorkspaceType.hasMany(models.Workspace, {
                foreignKey: "workspace_type_id",
            });
        }
    }

    WorkspaceType.init(
        {
            workspace_type_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            workspace_type_name: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            status: {
                type: DataTypes.ENUM("active", "inactive"),
                defaultValue: "inactive",
            },
        },
        {
            sequelize,
            modelName: "WorkspaceType",
            tableName: "WorkspaceType",
            timestamps: true,
            underscored: true,
        }
    );

    return WorkspaceType;
};
