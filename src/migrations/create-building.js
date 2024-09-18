'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Building', {
            building_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            building_name: {
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
            location: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            amenities: {
                type: Sequelize.STRING(250),
                allowNull: false
            },
            workspace_id: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            rating: {
                type: Sequelize.DECIMAL(3, 2),
                defaultValue: null
            },
            image: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            manager_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Manager',
                //     key: 'manager_id'
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
        await queryInterface.dropTable('Building');
    }
};

