import { env as env_setup } from "./env";

const env = env_setup.NODE_ENV;

const config = {
	development: {
		username: env_setup.DB_USER,
		password: env_setup.DB_PASSWORD,
		database: env_setup.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
		firebase: {
			serviceAccount: './secrets/firebase/dev-firebase-service-account.json',
		},
	},
	test: {
		username: env_setup.DB_USER,
		password: env_setup.DB_PASSWORD,
		database: env_setup.DB_NAME,
		host: 'localhost',
		dialect: 'postgres',
		firebase: {
			serviceAccount: './secrets/firebase/dev-firebase-service-account.json',
		},
	},
	production: {
		username: env_setup.DB_USER,
		password: env_setup.DB_PASSWORD,
		database: env_setup.DB_NAME,
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
