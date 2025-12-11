// backend/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const storage = process.env.SQLITE_STORAGE || './database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

module.exports = sequelize;
