import env from './env';

const config = {
	development: {
		username: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
	},
	test: {
		username: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
	},
	production: {
		username: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
	},
};

export default config;
