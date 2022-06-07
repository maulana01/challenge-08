/** @format */

'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_game_histories', {
      id_history_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      skor: {
        type: Sequelize.BIGINT,
      },
      tanggal_bermain: {
        type: Sequelize.DATEONLY,
      },
      gameplay_video: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      id_user: {
        type: Sequelize.BIGINT,
        references: {
          model: 'user_games',
          key: 'id_user',
        },
        onUpdate: 'NO ACTION',
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
    await queryInterface.dropTable('user_game_histories');
  },
};
