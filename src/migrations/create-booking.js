'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Booking', {
            booking_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            booking_date: {
                type: Sequelize.DATE,
                defaultValue: null
            },
            workspace_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            utility_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            broken_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            total_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('approved', 'check-in', 'in-process', 'check-out', 'completed', 'cancelled'),
                allowNull: false
            },
            customer_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Customer',
                //     key: 'customer_id'
                // }
            },
            workspace_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Workspace',
                //     key: 'workspace_id'
                // }
            },
            payment_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Payment',
                //     key: 'payment_id'
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
        await queryInterface.dropTable('Booking');
    }
};

