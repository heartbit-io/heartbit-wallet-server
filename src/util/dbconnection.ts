import { log } from 'console';
import { Dialect, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;

if (!dbName || !dbUser || !dbHost || !dbDriver || !dbPassword) {
  log('Please ensure that you set the database connection parameters');
  process.exit(1);
}

const dbconnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  logging: false,
});

export default dbconnection;
