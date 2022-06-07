/** @format */

const { UserGameHistory, UserGame } = require('../models');
const moment = require('moment');
const path = require('path');
const fs = require('fs');

module.exports = {
  getAllUserGameHistoryViews: (req, res) => {
    UserGameHistory.findAll({
      attributes: ['id_history_user', 'gameplay_video', 'skor', 'tanggal_bermain', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_history', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        if (result.length > 0) {
          // res.status(200).json({ message: 'Berhasil Get All User Game History', result });
          res.render('usergameshistory/index', { usergameshistory: result, moment, page_name: 'usergameshistory' });
        } else {
          // res.status(404).json({ message: 'User Game History Tidak di temukan', result });
          res.render('usergameshistory/index', { usergameshistory: result, moment, page_name: 'usergameshistory' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get All User Game History', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  getUserGameHistoryByUserLoggedinViews: (req, res) => {
    UserGameHistory.findAll({
      attributes: ['id_history_user', 'gameplay_video', 'skor', 'tanggal_bermain', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_history', attributes: ['id_user', 'username'] }],
      where: {
        id_user: req.user.dataValues.id_user,
      },
    })
      .then((result) => {
        if (result.length > 0) {
          // res.status(200).json({ message: 'Berhasil Get All User Game History', result });
          res.render('usergameshistory/index_user', { usergameshistory: result, moment, page_name: 'usergameshistory' });
        } else {
          // res.status(404).json({ message: 'User Game History Tidak di temukan', result });
          res.render('usergameshistory/index_user', { usergameshistory: result, moment, page_name: 'usergameshistory' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get All User Game History', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  createUserGameHistoryFormViews: (req, res) => {
    UserGame.findAll({
      attributes: ['id_user', 'username'],
    })
      .then((result) => {
        res.render('usergameshistory/create', { usergames: result, page_name: 'usergameshistory' });
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get All User Game', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  createUserGameHistoryViews: (req, res) => {
    UserGameHistory.create({
      id_user: req.body.id_user,
      skor: req.body.skor,
      tanggal_bermain: req.body.tanggal_bermain,
      gameplay_video: req.file.filename,
    })
      .then((result) => {
        // res.status(200).json({ message: 'Berhasil Membuat User Game History', result });
        res.redirect('/view/usergameshistory');
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Membuat User Game History', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  deleteUserGameHistoryByHistoryIdViews: async (req, res) => {
    const getData = await UserGameHistory.findOne({
      where: {
        id_history_user: req.params.id,
      },
    });
    // console.log('ini hasil getdata buat delete datavalues', getData.dataValues.gameplay_video);
    // console.log('ini hasil getdata buat delete non datavalues', getData.gameplay_video);
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
    UserGameHistory.destroy({
      where: {
        id_history_user: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: 'Berhasil Menghapus User Game History', result });
          res.redirect('/view/usergameshistory');
        } else {
          // res.status(404).json({ message: 'User Game History dengan ID History ' + req.params.id + ' Tidak di temukan', result });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Menghapus User Game History', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  deleteUserGameHistoryByUserGameIdViews: async (req, res) => {
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
          // res.status(200).json({ message: 'Berhasil Menghapus User Game History', result });
          res.redirect('/view/usergameshistory');
        } else {
          // res.status(404).json({ message: 'User Game History dengan ID User ' + req.params.id + ' Tidak di temukan', result });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Menghapus User Game History', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
};
