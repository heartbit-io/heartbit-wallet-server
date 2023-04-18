const env = process.env.NODE_ENV || 'development';

const config = {
	development: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
		firebase: {
			serviceAccount: './secrets/firebase/dev-firebase-service-account.json',
		},
	},
	test: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
		firebase: {
			serviceAccount: './secrets/firebase/dev-firebase-service-account.json',
		},
	},
	production: {
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
		firebase: {
			serviceAccount: '',
		},
	},
}[env] as {
	username: string;
	password: string;
	database: string;
	host: string;
	dialect: string;
	firebase: {
		serviceAccount: string;
	};
};

export default config;
