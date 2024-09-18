'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Manager', {
            manager_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                // references: {
                //     model: 'Account',
                //     key: 'account_id'
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
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Manager');
    }
};
