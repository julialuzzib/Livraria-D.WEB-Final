const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

const DB_FILE = process.env.SQLITE_DB_FILE || path.join(__dirname, '../data/livraria.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DB_FILE,
  logging: false,
});

module.exports = { sequelize, DataTypes };
