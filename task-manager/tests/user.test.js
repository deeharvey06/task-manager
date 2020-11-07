const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const { USER_ONE_ID, USER_ONE, setUpDatabase } = require('./fixtures/db');

const EXPECTED_USER = {
  name: 'Cliff',
  email: 'cliff@example.com',
  password: 'password'
}

beforeEach(setUpDatabase);

test('Should signup a new user', async () => {
  const res = await request(app).post('/users').send(EXPECTED_USER)
  .expect(201);

  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();
  expect(res.body).toMatchObject({
    user: EXPECTED_USER,
    token: user.tokens[0].token,
  });
  expect(user.password).not.toBe(EXPECTED_USER.password);
});

test('Should login existing user', async () => {
  const res = await request(app).post('/users/login').send({
    email: USER_ONE.email,
    password: USER_ONE.password,
  }).expect(200);

  const user = await User.findById(USER_ONE_ID);
  expect(user).not.toBeNull();
  expect(res.body.token).toBe(user.tokens[1].token);
});

test('Should not login nonexistent user', async () => {
  await request(app).post('/users/login').send({
    email: 'dennis@example.com',
    password: 'dontStudy',
  }).expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${USER_ONE.tokens[0].token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthorization user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${USER_ONE.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(USER_ONE_ID);
  expect(user).toBeNull();
});

test('Should not delete account for unauthorization', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
});

test('should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${USER_ONE.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/basic_linux.jpeg')
    .expect(200)

    const user = await User.findById(USER_ONE_ID);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${USER_ONE.tokens[0].token}`)
    send({
      name: 'Bill'
    })
    .expect(200);

    const user = await User.findById(USER_ONE_ID);
    expect(user.name).toEqual('Fred');
});

test('Should not update valid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${USER_ONE.tokens[0].token}`)
    .send({
      location: 'New York'
    })
    .expect(400);
});

