/** @format */

const { UserGame } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

module.exports = {
  getAllUserGameApi: (req, res) => {
    UserGame.findAll()
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json({ message: 'Berhasil Get All User Game', result });
        } else {
          res.status(404).json({ message: 'User Game Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get All User Game', err: err.message });
      });
  },
  getUserGameByIdApi: (req, res) => {
    UserGame.findOne({
      where: {
        id_user: req.params.id,
      },
    })
      .then((result) => {
        if (result) {
          res.status(200).json({ message: 'Berhasil Get User Game By Id', result });
        } else {
          res.status(404).json({ message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get User Game By Id', err: err.message });
      });
  },
  getUserGameByLoggedInUserApi: (req, res) => {
    UserGame.findOne({
      where: {
        id_user: req.user.id_user,
      },
    })
      .then((result) => {
        res.status(200).json({ message: 'Berhasil Get User Game By Logged In User', result });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Get User Game By Logged In User', err: err.message });
      });
  },
  createUserGameApi: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(req.user);
      // console.log('ini req aja', req);
      const user = await UserGame.create({
        username,
        email: email,
        password: hashedPassword,
        avatar: req.file != null ? req.file.filename : null,
        id_role: req.body.id_role,
      });
      const token = jwt.sign({ id_user: user.id_user }, process.env.TOKEN_KEY, {
        expiresIn: '15m',
      });
      user.token = token;

      res.status(200).json({ message: 'Berhasil Membuat User Game', result: user });
    } catch (error) {
      res.status(500).json({ message: 'Gagal Create User Game', err: error.message });
    }
  },
  updateUserGameApi: async (req, res) => {
    const getData = await UserGame.findOne({
      where: {
        id_user: req.params.id,
      },
    });
    req.method = req.body._method;
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    if (getData.avatar) {
      const _path = path.join(__dirname, '..', 'images', getData.avatar);
      // console.log('ini path', _path);
      if (fs.existsSync(_path)) {
        fs.unlinkSync(_path, (err) => {
          if (err) {
            console.log('failed to delete local image:' + err);
          } else {
            console.log('successfully deleted local image');
          }
        });
      }
    }
    UserGame.update(
      {
        username: username,
        email: email,
        password: hashedPassword,
        avatar: req.file != null ? req.file.filename : null,
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
          res.status(404).json({
            message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan',
            result,
          });
        } else {
          res.status(200).json({ message: 'Berhasil Mengupdate User Game', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Mengupdate User Game', err: err.message });
      });
  },
  deleteUserGameApi: async (req, res) => {
    const getData = await UserGame.findOne({
      where: {
        id_user: req.params.id,
      },
    });
    console.log('tes aja ni', getData);
    if (getData !== null) {
      if (getData.avatar) {
        const _path = path.join(__dirname, '..', 'images', getData.dataValues.avatar);
        if (fs.existsSync(_path)) {
          fs.unlinkSync(_path, (err) => {
            if (err) {
              console.log('failed to delete local image:' + err);
            } else {
              console.log('successfully deleted local image');
            }
          });
        }
      }
    }
    UserGame.destroy({
      where: {
        id_user: req.params.id,
      },
    })
      .then((result) => {
        if (result === 0) {
          res.status(404).json({
            message: 'User Game dengan ID ' + req.params.id + ' Tidak di temukan',
            result,
          });
        } else {
          res.status(200).json({ message: 'Berhasil Menghapus User Game', result });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: 'Gagal Menghapus User Game', err: err.message });
      });
  },
};
