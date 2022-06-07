/** @format */

const { UserGameBiodata, UserGame } = require('../models');
const moment = require('moment');

module.exports = {
  getAllUserGameBiodataApi: (req, res) => {
    UserGameBiodata.findAll({
      attributes: ['id_biodata_user', 'nama', 'tanggal_lahir', 'tempat_lahir', 'alamat', 'no_hp', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_biodata', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ message: 'Berhasil Get All User Game Biodata', result });
        } else {
          res.status(404).json({ message: 'User Game Biodata Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get All User Game Biodata', err: err.message });
      });
  },
  getUserGameBiodataByLoggedInUserApi: (req, res) => {
    UserGameBiodata.findOne({
      where: {
        id_user: req.user.id_user,
      },
      attributes: ['id_biodata_user', 'nama', 'tanggal_lahir', 'tempat_lahir', 'alamat', 'no_hp', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_biodata', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        res.status(200).json({ message: 'Berhasil Get User Game Biodata By Logged In User', result });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get User Game Biodata By Logged In User', err: err.message });
      });
  },
  getUserGameBiodataByIdApi: (req, res) => {
    UserGameBiodata.findOne({
      where: {
        id_user: req.params.id,
      },
      attributes: ['id_biodata_user', 'nama', 'tanggal_lahir', 'tempat_lahir', 'alamat', 'no_hp', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_biodata', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: 'Berhasil Get User Game Biodata By Id', result });
        } else {
          res.status(404).json({ message: 'User Game Biodata dengan ID ' + req.params.id + ' Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get User Game Biodata By Id', err: err.message });
      });
  },
  createUserGameBiodataApi: (req, res) => {
    UserGameBiodata.create({
      nama: req.body.nama,
      tanggal_lahir: req.body.tanggal_lahir,
      tempat_lahir: req.body.tempat_lahir,
      alamat: req.body.alamat,
      no_hp: req.body.no_hp,
      id_user: req.body.id_user,
    })
      .then((result) => {
        res.status(200).json({ message: 'Berhasil Membuat User Game Biodata', result });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Membuat User Game Biodata', err: err.message });
      });
  },
  updateUserGameBiodataApi: (req, res) => {
    req.method = req.body._method;
    UserGameBiodata.update(
      {
        nama: req.body.nama,
        tanggal_lahir: req.body.tanggal_lahir,
        tempat_lahir: req.body.tempat_lahir,
        alamat: req.body.alamat,
        no_hp: req.body.no_hp,
      },
      {
        where: {
          id_user: req.params.id,
        },
      }
    )
      .then((result) => {
        if (result[0] === 0) {
          res.status(404).json({
            message: 'User Game Biodata dengan ID ' + req.params.id + ' Tidak di temukan',
            result,
          });
        } else {
          res.status(200).json({ message: 'Berhasil Mengupdate User Game Biodata', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Mengupdate User Game Biodata', err: err.message });
      });
  },
  deleteUserGameBiodataApi: (req, res) => {
    UserGameBiodata.destroy({
      where: {
        id_user: req.params.id,
      },
    })
      .then((result) => {
        if (result === 0) {
          res.status(404).json({
            message: 'User Game Biodata dengan ID ' + req.params.id + ' Tidak di temukan',
            result,
          });
        } else {
          res.status(200).json({ message: 'Berhasil Menghapus User Game Biodata', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Menghapus User Game Biodata', err: err.message });
      });
  },
};
