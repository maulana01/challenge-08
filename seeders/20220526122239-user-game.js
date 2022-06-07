/** @format */

'use strict';
const bcrypt = require('bcrypt');
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
      'user_games',
      [
        {
          username: 'admin',
          email: 'admin@mail.com',
          password: await bcrypt.hash('admin', 10),
          avatar: null,
          token: null,
          id_role: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'user',
          email: 'user@mail.com',
          password: await bcrypt.hash('user', 10),
          avatar: null,
          token: null,
          id_role: 2,
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
