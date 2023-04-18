/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	development: {
		username: process.env.DB_USER,
		password:process.env.DB_PASSWORD,
		database:process.env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
	},
	test: {
		username: process.env.DB_USER,
		password:process.env.DB_PASSWORD,
		database:process.env.TEST_DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
	},
	production: {
		username: process.env.DB_USER,
		password:process.env.DB_PASSWORD,
		database:process.env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
	},
};
