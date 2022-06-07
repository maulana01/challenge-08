/** @format */

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGameHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.UserGame, { as: 'user_game_history', foreignKey: 'id_user' });
    }
  }
  UserGameHistory.init(
    {
      id_history_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      skor: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Skor tidak boleh kosong!',
          },
        },
      },
      tanggal_bermain: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: new Date().getTime(),
        validate: {
          notNull: {
            msg: 'Tanggal Bermain tidak boleh kosong!',
          },
        },
      },
      gameplay_video: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Username tidak boleh kosong!',
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'user_game_histories',
      modelName: 'UserGameHistory',
    }
  );
  return UserGameHistory;
};
