'use strict';

const {v4} = require("uuid");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert('Role', [{
            role_id: 1,
            role_name: 'Admin',
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            role_id: 2,
            role_name: 'Manager',
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            role_id: 3,
            role_name: 'Staff',
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        }, {
            role_id: 4,
            role_name: 'Customer',
            status: 'active',
            created_at: new Date(),
            updated_at: new Date()
        }], {});

    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};