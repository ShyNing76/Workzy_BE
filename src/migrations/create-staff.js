'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Staff', {
            staff_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                // references: {
                //     model: 'Account',
                //     key: 'account_id'
                // }
            },
            // first_name: {
            //     type: Sequelize.STRING(100),
            //     allowNull: false
            // },
            // last_name: {
            //     type: Sequelize.STRING(100),
            //     allowNull: false
            // },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            building_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Building',
                //     key: 'building_id'
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
        await queryInterface.dropTable('Staff');
    }
};

