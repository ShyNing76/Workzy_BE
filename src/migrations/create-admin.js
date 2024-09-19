'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Admin', {
            admin_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'Account',
                    key: 'account_id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Admin');
    }
};
