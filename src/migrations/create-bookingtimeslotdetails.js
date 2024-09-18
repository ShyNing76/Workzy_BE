'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('BookingTimeSlotDetails', {
            booking_time_slot_id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            booking_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'Booking',
                //     key: 'booking_id'
                // }
            },
            time_slot_id: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: 'TimeSlot',
                //     key: 'time_slot_id'
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
        await queryInterface.dropTable('BookingTimeSlotDetails');
    }
};

