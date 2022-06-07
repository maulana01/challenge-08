/** @format */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_games', {
      id_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.TEXT,
      },
      password: {
        type: Sequelize.TEXT,
      },
      avatar: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      otp: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      otp_exp: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_role: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_games');
  },
};
