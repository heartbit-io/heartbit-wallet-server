import { log } from 'console';
import { Dialect, Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const db_name = process.env.DB_NAME as string;
const db_user = process.env.DB_USER as string;
const db_host = process.env.DB_HOST;
const db_driver = process.env.DB_DRIVER as Dialect;
const db_password = process.env.DB_PASSWORD;

if (!db_name || !db_user || !db_host || !db_driver || !db_password) {
    log('Please ensure that you set the database connection parameters');
    process.exit(1);
}

const dbconnection = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  dialect: db_driver,
  logging: false,
});

export default dbconnection;
