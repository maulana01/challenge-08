/** @format */

const { UserGame } = require('../models');
const moment = require('moment');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

module.exports = {
  getAllUserGameViews: (req, res) => {
    UserGame.findAll({
      attributes: ['id_user', 'username', 'avatar', 'email', 'password', 'createdAt', 'updatedAt'],
    })
      .then((result) => {
        if (result.length > 0) {
          // res.status(200).json({ message: 'Berhasil Get All User Game', result });
          // console.log(req.session);
          // console.log(req.user.dataValues);
          res.render('usergames/index', { usergames: result, moment, page_name: 'usergames' });
        } else {
          // res.status(404).json({ message: 'User Game Tidak di temukan', result });
          res.render('usergames/index', { usergames: result, moment, page_name: 'usergames' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get All User Game', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  getUserGameByUserLoggedinViews: (req, res) => {
    UserGame.findOne({
      where: {
        id_user: req.user.dataValues.id_user,
      },
    })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: 'Berhasil Get User Game By Id', result });
          res.render('usergames/index_user', { usergame: result.dataValues, page_name: 'usergames', moment });
        } else {
          // res.status(404).json({ message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan', result });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get User Game By Id', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  getUserGameByIdViews: (req, res) => {
    UserGame.findOne({
      where: {
        id_user: req.params.id,
      },
      attributes: ['id_user', 'username', 'avatar', 'email', 'password', 'createdAt', 'updatedAt'],
    })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: 'Berhasil Get User Game By Id', result });
          res.render('usergames/update', { usergame: result, page_name: 'usergames' });
        } else {
          // res.status(404).json({ message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan', result });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get User Game By Id', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  createUserGameFormViews: (req, res) => {
    res.render('usergames/create', { page_name: 'usergames' });
  },
  createUserGameViews: async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // console.log('ini req aja', req);
    UserGame.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      avatar: req.file.filename,
      id_role: req.body.id_role,
    })
      .then((result) => {
        req.flash('success', 'Berhasil membuat user game');
        res.redirect('/view');
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Membuat User Game', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  updateUserGameViews: async (req, res) => {
    req.method = req.body._method;
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (req.body.avatar_name) {
      const _path = path.join(__dirname, '..', 'images', req.body.avatar_name);
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
    UserGame.update(
      {
        username: username,
        email: email,
        password: hashedPassword,
        avatar: req.file.filename,
        id_role: req.body.id_role,
      },
      {
        where: {
          id_user: req.params.id,
        },
      }
    )
      .then((result) => {
        if (result[0] === 0) {
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        } else {
          res.redirect('/view');
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Mengupdate User Game', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  deleteUserGameViews: async (req, res) => {
    const getData = await UserGame.findOne({
      where: {
        id_user: req.params.id,
      },
    });
    // console.log('ini hasil getdata buat delete', getData.dataValues.avatar);
    // if (getData !== null) {
    // if (getData.avatar) {
    const _path = path.join(__dirname, '..', 'images', getData.dataValues.avatar);
    // console.log('ini path', _path);
    fs.unlinkSync(_path, (err) => {
      if (err) {
        console.log('failed to delete local image:' + err);
      } else {
        console.log('successfully deleted local image');
      }
    });
    // }
    //   }
    // }
    UserGame.destroy({
      where: {
        id_user: req.params.id,
      },
    })
      .then((result) => {
        if (result === 0) {
          // res.status(404).json({
          //   message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan',
          //   result,
          // });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        } else {
          // res.status(200).json({ message: 'Berhasil Menghapus User Game', result });
          res.redirect('/view');
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Menghapus User Game', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
};
