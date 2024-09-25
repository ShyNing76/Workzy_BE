"use strict";
const {Model} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Review.belongsTo(models.Booking, {foreignKey: "booking_id"});
        }
    }

    Review.init(
        {
            review_id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            booking_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            review_content: {
                type: DataTypes.TEXT,
                defaultValue: "",
            },
            rating: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: "Review",
            tableName: "Review",
            timestamps: true,
            underscored: true,
        }
    );

    return Review;
};
