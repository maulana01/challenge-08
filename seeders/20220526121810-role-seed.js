/** @format */

'use strict';

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
    await queryInterface.bulkInsert(
      'user_roles',
      [
        {
          role_name: 'Admin',
          role_desc: 'Dapat mengakses semua fitur',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          role_name: 'User',
          role_desc: 'Hanya dapat mengakses data',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
