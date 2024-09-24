"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class WorkspaceImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            WorkspaceImage.belongsTo(models.Workspace, {foreignKey: "workspace_id"})
        }
    }

    WorkspaceImage.init(
        {
            workspace_image_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            workspace_id: {
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
            modelName: "WorkspaceImage",
            tableName: "WorkspaceImage",
            timestamps: true,
            underscored: true,
        }
    );

    return WorkspaceImage;
};
