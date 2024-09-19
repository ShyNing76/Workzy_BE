'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Customer', {
            customer_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                references: {
                    model: 'Account',
                    key: 'account_id'
                },
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            gender: {
                type: Sequelize.BOOLEAN,
                defaultValue: true
            },
            date_of_birth: {
                type: Sequelize.DATE,
                defaultValue: null
            },
            point: {
                type: Sequelize.INTEGER,
                defaultValue: 0
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
        await queryInterface.dropTable('Customer');
    }
};
