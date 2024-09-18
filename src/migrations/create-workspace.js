'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Workspace', {
            workspace_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            workspace_name: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            status: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            amenities: {
                type: Sequelize.STRING(250),
                allowNull: false
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            rating: {
                type: Sequelize.DECIMAL(3, 2),
                defaultValue: 0.00
            },
            building_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Building',
                //     key: 'building_id'
                // }
            },
            price_per_hour: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
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
        await queryInterface.dropTable('Workspace');
    }
};

