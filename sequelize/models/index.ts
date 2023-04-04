import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import process from 'process';
import config from '../config/config.js';

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
export const db = {};


let env_variables;

if (env === 'dev') {
  env_variables = config.development;
} else if (env === 'test') {
  env_variables = config.test;
} else {
  env_variables = config.production;
}

const sequelize = new Sequelize(
  env_variables.database,
  env_variables.username,
  env_variables.password,
  { host: env_variables.host, dialect: env_variables.dialect }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db['sequelize'] = sequelize;
db['Sequelize'] = Sequelize;

module.exports = db;
