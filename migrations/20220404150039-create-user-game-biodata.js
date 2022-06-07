/** @format */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_game_biodata', {
      id_biodata_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama: {
        type: Sequelize.TEXT,
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY,
      },
      tempat_lahir: {
        type: Sequelize.TEXT,
      },
      alamat: {
        type: Sequelize.TEXT,
      },
      no_hp: {
        type: Sequelize.TEXT,
      },
      id_user: {
        type: Sequelize.BIGINT,
        references: {
          model: 'user_games',
          key: 'id_user',
        },
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
    await queryInterface.dropTable('user_game_biodata');
  },
};
