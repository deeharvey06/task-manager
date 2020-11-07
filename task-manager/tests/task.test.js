const request = require('supertest');

const app = require('../src/app');
const Task = require('../src/models/task');
const {
  USER_ONE_ID,
  USER_TWO_ID,
  USER_ONE,
  USER_TWO,
  TASK_ONE_ID,
  TASK_TWO_ID ,
  TASK_THREE_ID,
  TASK_ONE,
  TASK_TWO,
  TASK_THREE,
  setUpDatabase
} = require('./fixtures/db');

beforeEach(setUpDatabase);

test('Should create task for user', async () => {
  const res = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${USER_ONE.tokens[0].token}`)
    .send({
      description: 'From my test',
    })
    .expect(201);

    const task = await Task.findById(res.body._id);
    expect(task).not.tobeNull();
    expect(task.completed).toEqual(false);
    expect(task.description).toEqual('From my test');
});

test('Should fetch user tasks', async () => {
  const res = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${USER_ONE.tokens[0].token}`)
    .send()
    .expect(200);

  expect(res.body.length).toBe(2);
});

test('Should not detele other users task', async () => {
  const res = await request(app)
    .delete(`/tasks/${TASK_ONE_ID}`)
    .set('Authorization', `Bearer ${USER_TWO.tokens[0].token}`)
    .send()
    .expect(404);

  const task = await Task.findById(TASK_ONE_ID);
  expect(task).not.toBeNull();
});