'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Review', {
            review_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            review_content: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            rating: {
                type: Sequelize.DECIMAL(3, 2),
                allowNull: false
            },
            booking_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                // references: {
                //     model: 'Booking',
                //     key: 'booking_id'
                // }
            },
            workspace_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                // references: {
                //     model: 'Workspace',
                //     key: 'workspace_id'
                // }
            },
            created_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updated_at: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Review');
    }
};
