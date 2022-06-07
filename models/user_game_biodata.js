/** @format */

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGameBiodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.UserGame, { foreignKey: 'id_user', as: 'user_game_biodata' });
    }
  }
  UserGameBiodata.init(
    {
      id_biodata_user: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Nama tidak boleh kosong!',
          },
        },
      },
      tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Tanggal Lahir tidak boleh kosong!',
          },
        },
      },
      tempat_lahir: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Tempat Lahir tidak boleh kosong!',
          },
        },
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Alamat tidak boleh kosong!',
          },
        },
      },
      no_hp: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'No HP tidak boleh kosong!',
          },
        },
      },
      id_user: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
        validate: {
          isUnique: (value, next) => {
            UserGameBiodata.findAll({
              where: { id_user: value },
              attributes: ['id_user'],
            })
              .then((user) => {
                if (user.length != 0) next(new Error('Username Telah digunakan!'));
                next();
              })
              .catch((onError) => console.log(onError));
          },
          notNull: {
            msg: 'Username tidak boleh kosong!',
          },
        },
      },
    },
    {
      sequelize,
      tableName: 'user_game_biodata',
      modelName: 'UserGameBiodata',
    }
  );
  return UserGameBiodata;
};
