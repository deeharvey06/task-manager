const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/user');
const Task = require('../../src/models/task');

const USER_ONE_ID = new mongoose.Types.ObjectId;
const USER_TWO_ID = new mongoose.Types.ObjectId;

const TASK_ONE_ID = new mongoose.Types.ObjectId;
const TASK_TWO_ID = new mongoose.Types.ObjectId;
const TASK_THREE_ID = new mongoose.Types.ObjectId;



const USER_ONE = {
  _id: USER_ONE_ID,
  name: 'Dennis',
  email: 'dennis@example.com',
  password: 'secret',
  tokens: [{
    token: jwt.sign({ _id: USER_ONE_ID }, 'backenCourse')
  }]
}

const USER_TWO = {
  _id: USER_TWO_ID,
  name: 'Fred',
  email: 'fred@example.com',
  password: 'big secret',
  tokens: [{
    token: jwt.sign({ _id: USER_TWO_ID }, 'backenCourse')
  }]
}

const TASK_ONE = {
  _id: TASK_ONE_ID,
  description: 'Frist Task',
  completed: false,
  owner: USER_ONE_ID
}

const TASK_TWO = {
  _id: TASK_TWO_ID,
  description: 'Second Task',
  completed: true,
  owner: USER_ONE_ID
}

const TASK_THREE = {
  _id: TASK_THREE_ID
  description: 'Third Task',
  completed: true,
  owner: USER_TWO_ID
}

const setUpDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(USER_ONE).save();
  await new User(USER_TWO).save();
  await new Task(TASK_ONE).save();
  await new Task(TASK_TWO).save();
  await new Task(TASK_THREE).save();
}

module.exports = {
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
  setUpDatabase,
}