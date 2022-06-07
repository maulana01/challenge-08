/** @format */

const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
require('../controllers/auth_api');
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

  test('run /api/register To Register a new User', async () => {
    const { body, statusCode } = await request(app)
      .post('/api/register')
      .send({ username: 'maulana', email: 'maulana@mail.com', password: 'maulana', id_role: 1 });
    expect(statusCode).toEqual(200);
    expect(body.message).toEqual('Berhasil Membuat User Game');
    expect(body.result.username).toEqual('maulana');
    expect(body.result.email).toEqual('maulana@mail.com');
    expect(body.result.password).toEqual(body.result.password);
  });

  test('run /api/register To Register Already Exist User and Fail', async () => {
    const { body, statusCode } = await request(app)
      .post('/api/register')
      .send({ username: 'maulana', email: 'maulana@mail.com', password: 'maulana', id_role: 1 });
    expect(statusCode).toEqual(500);
    expect(body.message).toEqual('Gagal Create User Game');
    expect(body.err).toEqual('Validation error: Username Telah digunakan!,\nValidation error: Email Telah digunakan!');
  });

  test('run /api/login To Do Login', async () => {
    const { body, statusCode } = await request(app).post('/api/login').send({ username: 'maulana', password: 'maulana' });
    expect(statusCode).toEqual(200);
    expect(body.username).toEqual('maulana');
    expect(body.email).toEqual('maulana@mail.com');
    expect(body.password).toEqual(body.password);
  });

  test('run /api/login To Do Login with Empty field', async () => {
    const { statusCode, error } = await request(app).post('/api/login').send({ username: '', password: '' });
    expect(statusCode).toEqual(400);
    expect(error.text).toEqual('All input is required');
  });

  test('run /api/login To Do Login with Wrong Credentials', async () => {
    const { statusCode, error } = await request(app).post('/api/login').send({ username: 'maulana', password: 'acimonde' });
    expect(statusCode).toEqual(400);
    expect(error.text).toEqual('Username atau Password salah!');
  });
});
