/** @format */

const { UserGameHistory, UserGame } = require('../models');
const path = require('path');
const fs = require('fs');
const moment = require('moment');

module.exports = {
  getAllUserGameHistoryApi: (req, res) => {
    UserGameHistory.findAll({
      attributes: ['id_history_user', 'skor', 'tanggal_bermain', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_history', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ message: 'Berhasil Get All User Game History', result });
        } else {
          res.status(404).json({ message: 'User Game History Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get All User Game History', err: err.message });
      });
  },
  getUserGameHistoryByIdApi: (req, res) => {
    UserGameHistory.findAll({
      where: {
        id_user: req.params.id,
      },
      attributes: ['id_history_user', 'id_user', 'skor', 'tanggal_bermain', 'createdAt', 'updatedAt'],
    })
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ message: 'Berhasil Get All User Game History By id_user', result });
        } else {
          res.status(404).json({ message: 'User Game History dengan ID ' + req.params.id + ' Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get User Game History By Id', err: err.message });
      });
  },
  getUserGameHistoryByLoggedInUserApi: (req, res) => {
    UserGameHistory.findAll({
      where: {
        id_user: req.user.id_user,
      },
    })
      .then((result) => {
        res.status(200).json({ message: 'Berhasil Get All User Game History By Logged In User', result });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get User Game History By Logged In User', err: err.message });
      });
  },
  createUserGameHistoryApi: (req, res) => {
    UserGameHistory.create({
      id_user: req.body.id_user,
      skor: req.body.skor,
      tanggal_bermain: req.body.tanggal_bermain,
      gameplay_video: req.file.filename != null ? req.file.filename : null,
    })
      .then((result) => {
        res.status(200).json({ message: 'Berhasil Membuat User Game History', result });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Membuat User Game History', err: err.message });
      });
  },
  deleteUserGameHistoryByHistoryIdApi: async (req, res) => {
    const getData = await UserGameHistory.findOne({
      where: {
        id_history_user: req.params.id,
      },
    });
    // console.log('ini hasil getdata buat delete', getData.dataValues.avatar);
    if (getData !== null) {
      if (getData.gameplay_video) {
        const _path = path.join(__dirname, '..', 'videos', getData.gameplay_video);
        // console.log('ini path', _path);
        fs.unlinkSync(_path, (err) => {
          if (err) {
            console.log('failed to delete local image:' + err);
          } else {
            console.log('successfully deleted local image');
          }
        });
        // }
      }
    }
    UserGameHistory.destroy({
      where: {
        id_history_user: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: 'Berhasil Menghapus User Game History', result });
        } else {
          res.status(404).json({ message: 'User Game History dengan ID History ' + req.params.id + ' Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Menghapus User Game History', err: err.message });
      });
  },
  deleteUserGameHistoryByUserGameIdApi: async (req, res) => {
    const getData = await UserGameHistory.findAll({
      where: {
        id_user: req.params.id,
      },
    });
    getData.forEach((data, index) => {
      // console.log('ini data buat delete all history video', data);
      if (data.gameplay_video) {
        const _path = path.join(__dirname, '..', 'videos', data.gameplay_video);
        fs.unlinkSync(_path, (err) => {
          if (err) {
            console.log('failed to delete local image:' + err);
          } else {
            console.log('successfully deleted local image');
          }
        });
      }
    });
    UserGameHistory.destroy({
      where: {
        id_user: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: 'Berhasil Menghapus User Game History', result });
        } else {
          res.status(404).json({ message: 'User Game History dengan ID User ' + req.params.id + ' Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Menghapus User Game History', err: err.message });
      });
  },
};
