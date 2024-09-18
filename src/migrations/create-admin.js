'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Admin', {
            admin_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                // references: {
                //     model: 'Account',
                //     key: 'accountId'
                // }
            },
            full_name: {
                type: Sequelize.STRING(100),
                allowNull: false
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Admin');
    }
};
