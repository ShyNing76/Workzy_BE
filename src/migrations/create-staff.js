'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Staff', {
            staff_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                // references: {
                //     model: 'Account',
                //     key: 'account_id'
                // }
            },
            phone: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            building_id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                // references: {
                //     model: 'Building',
                //     key: 'building_id'
                // }
            },
            status: {
                type: Sequelize.ENUM('active', 'inactive'),
                defaultValue: 'active',
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

