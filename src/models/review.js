'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        review_id: {
            type: DataTypes.INTEGER,
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
            type: DataTypes.INTEGER,
            references: {
                model: 'Booking',
                key: 'booking_id'
            }
        },
        workspace_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Workspace',
                key: 'workspace_id'
            }
        }
    }, {
        tableName: 'Review',
        timestamps: true,
        underscored: true
    });

    Review.associate = (models) => {
        Review.belongsTo(models.Booking, {foreignKey: 'booking_id'});
        Review.belongsTo(models.Workspace, {foreignKey: 'workspace_id'});
    };

    return Review;
};
