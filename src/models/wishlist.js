"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Wishlist extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Wishlist.belongsTo(models.Customer, {
                foreignKey: "customer_id",
                sourceKey: "customer_id",
            });
            Wishlist.belongsTo(models.Workspace, {
                foreignKey: "workspace_id",
                sourceKey: "workspace_id",
            });
        }
    }

    Wishlist.init(
        {
            wishlist_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            customer_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            workspace_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Wishlist",
            tableName: "Wishlist",
            timestamps: true,
            underscored: true,
        }
    );

    return Wishlist;
};
