'use strict';

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
            role_name: 'Admin',
            status: 'active'
        }, {
            role_name: 'Manager',
            status: 'active'
        }, {
            role_name: 'Staff',
            status: 'active'
        }, {
            role_name: 'Customer',
            status: 'active',
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
