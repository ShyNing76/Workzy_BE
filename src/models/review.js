'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Review.belongsTo(models.Booking, {foreignKey: 'booking_id'});
            Review.belongsTo(models.Workspace, {foreignKey: 'workspace_id'});
        }
    }

    Review.init({
        review_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            autoIncrement: true
        },
        review_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false
        },
        booking_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Booking',
                key: 'booking_id'
            }
        },
        workspace_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            references: {
                model: 'Workspace',
                key: 'workspace_id'
            }
        }
    }, {
        sequelize,
        modelName: 'Review',
        tableName: 'Review',
        timestamps: true,
        underscored: true
    });

    return Review;
};
