/** @format */

const { sequelize, UserGameHistory } = require('../models');
const { QueryTypes } = require('sequelize');
require('../controllers/user_game_history_api');
require('../controllers/user_game_api');
const request = require('supertest');
const app = require('../app');

describe('User Games History API Controller Testing', () => {
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
    await request(app).post('/api/register').send({ username: 'user', email: 'user@mail.com', password: 'user', id_role: 2 });

    // await request(app).post('/api/register').send({ username: 'malik', email: 'malik@mail.com', password: 'malik' });
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

  test('run /api/get-user-game-histories To Get All User Games History with Auth', async () => {
    const inputUserGameHistory = await UserGameHistory.create({
      skor: 90,
      tanggal_bermain: '2022-05-10',
      gameplay_video: null,
      id_user: 1,
    });

    const { body, statusCode } = await request(app).get('/api/get-user-game-histories').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Get All User Game History');
    expect(body.result[body.result.length - 1].skor).toEqual(inputUserGameHistory.skor);
    expect(body.result[body.result.length - 1].tanggal_bermain).toEqual(inputUserGameHistory.tanggal_bermain);
    expect(body.result[body.result.length - 1].id_user).toEqual(inputUserGameHistory.id_user);
    expect(body.result).toHaveLength(1);
  });

  test('run /api/get-user-game-histories To Get All User Games History without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).get('/api/get-user-game-histories');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/get-user-game-history/:id To Find All User Games History By ID User with Auth', async () => {
    const { body, statusCode } = await request(app).get('/api/get-user-game-history/1').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Get All User Game History By id_user');
    expect(body.result[body.result.length - 1].skor).toEqual('90');
    expect(body.result[body.result.length - 1].tanggal_bermain).toEqual('2022-05-10');
    expect(body.result[body.result.length - 1].id_user).toEqual('1');
  });

  test('run /api/get-user-game-history/:id To Find All User Games History with unknown ID User and Fail', async () => {
    const { body, statusCode } = await request(app).get('/api/get-user-game-history/100').set({ Authorization: token });
    expect(statusCode).toEqual(404);
    expect(body.message).toEqual('User Game History dengan ID 100 Tidak di temukan');
  });

  test('run /api/get-user-game-history/:id To Find All User Games By ID User without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).get('/api/get-user-game-history/2');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/create-user-game-history To Create User Games History Data with Auth', async () => {
    const { body, statusCode, error } = await request(app).post('/api/create-user-game-history').set({ Authorization: token }).send({
      skor: 92,
      tanggal_bermain: '2022-05-11',
      gameplay_video: null,
      id_user: 1,
    });
    console.log('error create', error.text);
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Membuat User Game History');
    expect(body.result.skor).toEqual('92');
    expect(body.result.tanggal_bermain).toEqual('2022-05-11');
    expect(body.result.id_user).toEqual('1');
  });

  test('run /api/create-user-game-history To Create User Games Data without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).post('/api/create-user-game-history').send({
      skor: 92,
      tanggal_bermain: '2022-05-11',
      gameplay_video: null,
      id_user: 1,
    });
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/delete-user-game-history-id/:id To Delete One User Games History Data By ID History with Auth', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-game-history-id/1').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Menghapus User Game History');
    expect(body.result).toEqual(1);
  });

  test('run /api/delete-user-game-history-id/:id To Delete One User Games History with unknown ID History and Fail', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-game-history-id/100').set({ Authorization: token });
    expect(statusCode).toEqual(404);
    expect(body.message).toEqual('User Game History dengan ID History 100 Tidak di temukan');
    expect(body.result).toEqual(0);
  });

  test('run /api/delete-user-game-history-id/:id To Delete One User Games History Data By ID History without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).delete('/api/delete-user-game-history-id/1');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/delete-user-game-history-usergameid/:id To Delete All User Games History Data By ID User with Auth', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-game-history-usergameid/1').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Menghapus User Game History');
    expect(body.result).toEqual(1);
  });

  test('run /api/delete-user-game-history-usergameid/:id To Delete All User Games History with unknown ID User and Fail', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-game-history-usergameid/100').set({ Authorization: token });
    expect(statusCode).toEqual(404);
    expect(body.message).toEqual('User Game History dengan ID User 100 Tidak di temukan');
    expect(body.result).toEqual(0);
  });

  test('run /api/delete-user-game-history-usergameid/:id To Delete All User Games History Data By ID User without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).delete('/api/delete-user-game-history-usergameid/1');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });
});
