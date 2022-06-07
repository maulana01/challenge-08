/** @format */

const { sequelize, UserGameBiodata } = require('../models');
const { QueryTypes } = require('sequelize');
require('../controllers/user_game_biodata_api');
require('../controllers/user_game_api');
const request = require('supertest');
const app = require('../app');

describe('User Games Biodata API Controller Testing', () => {
  beforeAll(async () => {
    try {
      await sequelize.query(
        "INSERT INTO user_roles(role_name, role_desc) VALUES ('admin', 'Dapat mengakses semua fitur'),('user', 'Hanya dapat mengakses data')",
        {
          type: QueryTypes.RAW,
        }
      );
    } catch (error) {
      console.log('error ceunah', error);
    }
    await request(app).post('/api/register').send({ username: 'admin', email: 'admin@mail.com', password: 'admin', id_role: 1 });
    await request(app).post('/api/register').send({ username: 'user', email: 'user@mail.com', password: 'user', id_role: 1 });

    // await request(app).post('/api/register').send({ username: 'malik', email: 'malik@mail.com', password: 'malik' });
    // await request(app).post('/api/register').send({ username: 'admin', email: 'admin@mail.com', password: 'admin' });
    const login = await request(app).post('/api/login').send({ username: 'admin', password: 'admin' });
    token = login.body.token;
  });

  afterAll(async () => {
    try {
      await sequelize.query('TRUNCATE user_roles, user_games, user_game_biodata, user_game_histories RESTART IDENTITY;', {
        type: QueryTypes.RAW,
      });
    } catch (error) {
      console.log(error);
    }
  });

  test('run /api/get-user-game-biodatas To Get All User Games Biodata with Auth', async () => {
    const inputUserGameBiodata = await UserGameBiodata.create({
      nama: 'Maulana Imam Malik',
      tanggal_lahir: '2001-05-10',
      tempat_lahir: 'Serang, Banten',
      alamat: 'Jalan Raya Serang',
      no_hp: '085158304839',
      id_user: 1,
    });

    const { body, statusCode } = await request(app).get('/api/get-user-game-biodatas').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Get All User Game Biodata');
    expect(body.result[body.result.length - 1].nama).toEqual(inputUserGameBiodata.nama);
    expect(body.result[body.result.length - 1].tanggal_lahir).toEqual(inputUserGameBiodata.tanggal_lahir);
    expect(body.result[body.result.length - 1].tempat_lahir).toEqual(inputUserGameBiodata.tempat_lahir);
    expect(body.result[body.result.length - 1].alamat).toEqual(inputUserGameBiodata.alamat);
    expect(body.result[body.result.length - 1].no_hp).toEqual(inputUserGameBiodata.no_hp);
    expect(body.result[body.result.length - 1].id_user).toEqual(inputUserGameBiodata.id_user);
    expect(body.result).toHaveLength(1);
  });

  test('run /api/get-user-game-biodatas To Get All User Games Biodata without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).get('/api/get-user-game-biodatas');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/get-user-game-biodata/:id To Find One User Games Biodata By ID User with Auth', async () => {
    const { body, statusCode } = await request(app).get('/api/get-user-game-biodata/1').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Get User Game Biodata By Id');
    expect(body.result.nama).toEqual('Maulana Imam Malik');
    expect(body.result.tanggal_lahir).toEqual('2001-05-10');
    expect(body.result.tempat_lahir).toEqual('Serang, Banten');
    expect(body.result.alamat).toEqual('Jalan Raya Serang');
    expect(body.result.no_hp).toEqual('085158304839');
    expect(body.result.id_user).toEqual('1');
  });

  test('run /api/get-user-game-biodata/:id To Find One User Games Biodata with unknown ID User and Fail', async () => {
    const { body, statusCode } = await request(app).get('/api/get-user-game-biodata/100').set({ Authorization: token });
    expect(statusCode).toEqual(404);
    expect(body.message).toEqual('User Game Biodata dengan ID 100 Tidak di temukan');
  });

  test('run /api/get-user-game-biodata/:id To Find One User Games By ID User without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).get('/api/get-user-game-biodata/1');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/create-user-game-biodata To Create User Games Biodata Data with Auth', async () => {
    const { body, statusCode, error } = await request(app).post('/api/create-user-game-biodata').set({ Authorization: token }).send({
      nama: 'Putra Arifin',
      tanggal_lahir: '2000-06-11',
      tempat_lahir: 'Bandung, Jawa Barat',
      alamat: 'Jalan Raya Bandung',
      no_hp: '085144951042',
      id_user: 2,
    });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Membuat User Game Biodata');
    expect(body.result.nama).toEqual('Putra Arifin');
    expect(body.result.tanggal_lahir).toEqual('2000-06-11');
    expect(body.result.tempat_lahir).toEqual('Bandung, Jawa Barat');
    expect(body.result.alamat).toEqual('Jalan Raya Bandung');
    expect(body.result.no_hp).toEqual('085144951042');
    expect(body.result.id_user).toEqual('2');
  });

  test('run /api/create-user-game-biodata To Create Already Exist User Games Biodata Data and Fail', async () => {
    const { body, statusCode } = await request(app).post('/api/create-user-game-biodata').set({ Authorization: token }).send({
      nama: 'Putra Arifin',
      tanggal_lahir: '2000-06-11',
      tempat_lahir: 'Bandung, Jawa Barat',
      alamat: 'Jalan Raya Bandung',
      no_hp: '085144951042',
      id_user: 2,
    });
    expect(statusCode).toEqual(500);
    expect(body.message).toEqual('Gagal Membuat User Game Biodata');
  });

  test('run /api/create-user-game-biodata To Create User Games Data without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).post('/api/create-user-game-biodata').send({
      nama: 'Putra Arifin',
      tanggal_lahir: '2000-06-11',
      tempat_lahir: 'Bandung, Jawa Barat',
      alamat: 'Jalan Raya Bandung',
      no_hp: '085144951042',
      id_user: 2,
    });
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/update-user-game-biodata/:id To Update User Games Biodata Data with Auth', async () => {
    const { body, statusCode } = await request(app).put('/api/update-user-game-biodata/2').set({ Authorization: token }).send({
      alamat: 'Jalan Raya Bandung 02',
      no_hp: '085829495038',
    });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Mengupdate User Game Biodata');
    expect(body.result).toEqual([1]);
  });

  test('run /api/update-user-game-biodata/:id To Update User Games Biodata Data without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).put('/api/update-user-game-biodata/2').send({
      alamat: 'Jalan Raya Bandung 02',
      no_hp: '085829495038',
    });
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/delete-user-game-biodata/:id To Delete User Games Biodata Data with Auth', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-game-biodata/2').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Menghapus User Game Biodata');
    expect(body.result).toEqual(1);
  });

  test('run /api/delete-user-game-biodata/:id To Delete User Games Biodata with unknown ID User and Fail', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-game-biodata/100').set({ Authorization: token });
    expect(statusCode).toEqual(404);
    expect(body.message).toEqual('User Game Biodata dengan ID 100 Tidak di temukan');
    expect(body.result).toEqual(0);
  });

  test('run /api/delete-user-game-biodata/:id To Delete User Games Biodata Data without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).delete('/api/delete-user-game-biodata/2');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });
});
