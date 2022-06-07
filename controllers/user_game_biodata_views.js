/** @format */

const { UserGameBiodata, UserGame } = require('../models');
const moment = require('moment');

module.exports = {
  getAllUserGameBiodataViews: (req, res) => {
    UserGameBiodata.findAll({
      attributes: ['id_biodata_user', 'nama', 'tanggal_lahir', 'tempat_lahir', 'alamat', 'no_hp', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_biodata', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        if (result.length > 0) {
          // res.status(200).json({ message: 'Berhasil Get All User Game Biodata', result });
          res.render('usergamesbiodata/index', { usergamesbiodata: result, moment, page_name: 'usergamesbiodata' });
        } else {
          // res.status(404).json({ message: 'User Game Biodata Tidak di temukan', result });
          res.render('usergamesbiodata/index', { usergamesbiodata: result, moment, page_name: 'usergamesbiodata' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get All User Game Biodata', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  getUserGameBiodataByUserLoggedinViews: (req, res) => {
    UserGameBiodata.findOne({
      where: {
        id_user: req.user.dataValues.id_user,
      },
      attributes: ['id_biodata_user', 'nama', 'tanggal_lahir', 'tempat_lahir', 'alamat', 'no_hp', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_biodata', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: 'Berhasil Get User Game Biodata By Id', result });
          res.render('usergamesbiodata/index_user', { usergamebiodata: result.dataValues, moment, page_name: 'usergamesbiodata' });
        } else {
          // res.status(404).json({ message: 'User Game Biodata dengan ID ' + req.params.id + ' Tidak di temukan', result });
          res.render('usergamesbiodata/index_user', { usergamebiodata: result, moment, page_name: 'usergamesbiodata' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get User Game Biodata By Id', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  getUserGameBiodataByIdViews: (req, res) => {
    UserGameBiodata.findOne({
      where: {
        id_user: req.params.id,
      },
      attributes: ['id_biodata_user', 'nama', 'tanggal_lahir', 'tempat_lahir', 'alamat', 'no_hp', 'id_user', 'createdAt', 'updatedAt'],
      include: [{ model: UserGame, as: 'user_game_biodata', attributes: ['id_user', 'username'] }],
    })
      .then((result) => {
        if (result) {
          // res.status(200).json({ message: 'Berhasil Get User Game Biodata By Id', result });
          res.render('usergamesbiodata/update', { usergamebiodata: result, page_name: 'usergamesbiodata' });
        } else {
          // res.status(404).json({ message: 'User Game Biodata dengan ID ' + req.params.id + ' Tidak di temukan', result });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get User Game Biodata By Id', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  createUserGameBiodataFormUserRoleViews: (req, res) => {
    res.render('usergamesbiodata/create_user', { page_name: 'usergamesbiodata' });
  },
  createUserGameBiodataUserRoleViews: (req, res) => {
    UserGameBiodata.create({
      nama: req.body.nama,
      tanggal_lahir: req.body.tanggal_lahir,
      tempat_lahir: req.body.tempat_lahir,
      alamat: req.body.alamat,
      no_hp: req.body.no_hp,
      id_user: req.user.dataValues.id_user,
    })
      .then((result) => {
        // res.status(200).json({ message: 'Berhasil Membuat User Game Biodata', result });
        res.redirect('/viewroleuser/usergamesbiodata');
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Membuat User Game Biodata', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  createUserGameBiodataFormViews: (req, res) => {
    UserGame.findAll({
      attributes: ['id_user', 'username'],
    })
      .then((result) => {
        res.render('usergamesbiodata/create', { usergames: result, page_name: 'usergamesbiodata' });
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Get All User Game', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  createUserGameBiodataViews: (req, res) => {
    UserGameBiodata.create({
      nama: req.body.nama,
      tanggal_lahir: req.body.tanggal_lahir,
      tempat_lahir: req.body.tempat_lahir,
      alamat: req.body.alamat,
      no_hp: req.body.no_hp,
      id_user: req.body.id_user,
    })
      .then((result) => {
        // res.status(200).json({ message: 'Berhasil Membuat User Game Biodata', result });
        res.redirect('/view/usergamesbiodata');
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Membuat User Game Biodata', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  updateUserGameBiodataViews: (req, res) => {
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
          // res.status(404).json({
          //   message: 'User Game Biodata dengan ID ' + req.params.id + ' Tidak di temukan',
          //   result,
          // });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        } else {
          // res.status(200).json({ message: 'Berhasil Mengupdate User Game Biodata', result });
          res.redirect('/view/usergamesbiodata');
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Mengupdate User Game Biodata', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
  deleteUserGameBiodataViews: (req, res) => {
    UserGameBiodata.destroy({
      where: {
        id_user: req.params.id,
      },
    })
      .then((result) => {
        if (result === 0) {
          // res.status(404).json({
          //   message: 'User Game Biodata dengan ID ' + req.params.id + ' Tidak di temukan',
          //   result,
          // });
          res.render('error', { status: res.status(404), err: 'Data tidak ditemukan!' });
        } else {
          // res.status(200).json({ message: 'Berhasil Menghapus User Game Biodata', result });
          res.redirect('/view/usergamesbiodata');
        }
      })
      .catch((err) => {
        // res.status(500).json({ message: 'Gagal Menghapus User Game Biodata', err: err.message });
        res.render('error', { status: res.status(500), err: err.message });
      });
  },
};
