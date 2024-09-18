'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Customer', {
            customer_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                // references: {
                //     model: 'Account',
                //     key: 'accountId'
                // }
            },
            first_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING(100),
                allowNull: false
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
