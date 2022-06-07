/** @format */

const { UserGame, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
require('../controllers/user_game_api');
const request = require('supertest');
const app = require('../app');

describe('User Games API Controller Testing', () => {
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

  test('run /api/get-users-game To Get All User Games with Auth', async () => {
    const inputUserGames = await UserGame.create({ username: 'malik', email: 'malik@mail.com', password: 'malik', id_role: 1 });

    const { body, statusCode } = await request(app).get('/api/get-users-games').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Get All User Game');
    expect(body.result[body.result.length - 1].username).toEqual(inputUserGames.username);
    expect(body.result[body.result.length - 1].email).toEqual(inputUserGames.email);
    expect(body.result[body.result.length - 1].password).toEqual(inputUserGames.password);
    expect(body.result).toHaveLength(3);
  });

  test('run /api/get-users-game To Get All User Games without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).get('/api/get-users-games');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/get-user-games/:id To Find One User Games By ID with Auth', async () => {
    const { body, statusCode } = await request(app).get('/api/get-user-games/2').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Get User Game By Id');
    expect(body.result.username).toEqual('user');
    expect(body.result.email).toEqual('user@mail.com');
  });

  test('run /api/get-user-games/:id To Find One User Games with unknown ID and Fail', async () => {
    const { body, statusCode } = await request(app).get('/api/get-user-games/100').set({ Authorization: token });
    expect(statusCode).toEqual(404);
    expect(body.message).toEqual('User Game dengan ID 100 Tidak di temukan');
  });

  test('run /api/get-user-games/:id To Find One User Games By ID without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).get('/api/get-user-games/2');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/create-user-games To Create User Games Data with Auth', async () => {
    const { body, statusCode } = await request(app)
      .post('/api/create-user-games')
      .set({ Authorization: token })
      .send({ username: 'maulana', email: 'maulana@mail.com', password: 'maulana', id_role: 2 });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Membuat User Game');
    expect(body.result.username).toEqual('maulana');
    expect(body.result.email).toEqual('maulana@mail.com');
    expect(body.result.password).toEqual(body.result.password);
  });

  test('run /api/create-user-games To Create Already Exist User Games Data and Fail', async () => {
    const { body, statusCode } = await request(app)
      .post('/api/create-user-games')
      .set({ Authorization: token })
      .send({ username: 'maulana', email: 'maulana@mail.com', password: 'maulana', avatar: null, id_role: 2 });
    expect(statusCode).toEqual(500);
    expect(body.message).toEqual('Gagal Create User Game');
    expect(body.err).toEqual('Validation error: Username Telah digunakan!,\nValidation error: Email Telah digunakan!');
  });

  test('run /api/create-user-games To Create User Games Data without Auth and Fail', async () => {
    const { statusCode, error } = await request(app)
      .post('/api/create-user-games')
      .send({ username: 'arif', email: 'arif@mail.com', password: 'arif' });
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/update-user-games/:id To Update User Games Data with Auth', async () => {
    const { body, statusCode } = await request(app)
      .put('/api/update-user-games/3')
      .set({ Authorization: token })
      .send({ username: 'maulaja', email: 'maulmalik@mail.com', password: 'maullik20', avatar: null, id_role: 2 });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Mengupdate User Game');
    expect(body.result).toEqual([1]);
  });

  test('run /api/update-user-games/:id To Update User Games Data without Auth and Fail', async () => {
    const { statusCode, error } = await request(app)
      .put('/api/update-user-games/3')
      .send({ username: 'maulaja', email: 'maulmalik@mail.com', password: 'maullik20' });
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });

  test('run /api/delete-user-games/:id To Delete User Games Data with Auth', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-games/3').set({ Authorization: token });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Menghapus User Game');
    expect(body.result).toEqual(1);
  });

  test('run /api/delete-user-games/:id To Delete User Games with unknown ID and Fail', async () => {
    const { body, statusCode } = await request(app).delete('/api/delete-user-games/5').set({ Authorization: token });
    expect(statusCode).toEqual(404);
    expect(body.message).toEqual('User Game dengan ID 5 Tidak di temukan');
    expect(body.result).toEqual(0);
  });

  test('run /api/delete-user-games/:id To Delete User Games Data without Auth and Fail', async () => {
    const { statusCode, error } = await request(app).delete('/api/delete-user-games/3');
    expect(statusCode).toEqual(403);
    expect(error.text).toEqual('A token is required for authentication');
  });
});
