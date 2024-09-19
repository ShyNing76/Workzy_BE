'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Wishlist', {
            wishlist_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            customer_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                // references: {
                //     model: 'Customer',
                //     key: 'customer_id'
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
        await queryInterface.dropTable('Wishlist');
    }
};
