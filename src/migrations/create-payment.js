'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Payment', {
            payment_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            payment_method: {
                type: Sequelize.ENUM('paypal', 'card'),
                allowNull: false
            },
            payment_date: {
                type: Sequelize.DATE,
                defaultValue: null
            },
            payment_type: {
                type: Sequelize.ENUM('workspace-price', 'full', 'refund'),
                allowNull: false
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            transaction_id: {
                type: Sequelize.STRING(50),
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
        await queryInterface.dropTable('Payment');
    }
};

