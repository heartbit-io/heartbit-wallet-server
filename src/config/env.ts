import {config} from 'dotenv';
config();

export const env = {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV as string,
	DB_NAME: process.env.DB_NAME as string,
	DB_USER: process.env.DB_USER as string,
	DB_HOST: process.env.DB_HOST as string,
	DB_DRIVER: process.env.DB_DRIVER as string,
	DB_PASSWORD: process.env.DB_PASSWORD as string,
	TEST_DB_NAME: process.env.TEST_DB_NAME as string,
	OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY as string,
	FB_SERVICE_ACCOUNT: process.env.FB_SERVICE_ACCOUNT as string,
	FB_PROJECT_ID: process.env.FB_PROJECT_ID as string,
	FB_PRIVATE_KEY_ID: process.env.FB_PRIVATE_KEY_ID as string,
	FB_PRIVATE_KEY: process.env.FB_PRIVATE_KEY as string,
	FB_CLIENT_EMAIL: process.env.FB_CLIENT_EMAIL as string,
	FB_CLIENT_ID: process.env.FB_CLIENT_ID as string,
	FB_AUTH_URI: process.env.FB_AUTH_URI as string,
	FB_TOKEN_URI: process.env.FB_TOKEN_URI as string,
	FB_AUTH_PROVIDER_X509_CERT_URL: process.env
		.FB_AUTH_PROVIDER_X509_CERT_URL as string,
	FB_CLIENT_X509_CERT_URL: process.env.FB_CLIENT_X509_CERT_URL as string,
	FB_API_KEY: process.env.FB_API_KEY as string,
	FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN as string,
	FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET as string,
	FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID as string,
	FB_APP_ID: process.env.FB_APP_ID as string,
	FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID as string,
	AIRTABLE_API_KEY: process.env.AIRTABLE_API_KEY as string,
	AIRTABLE_URL: process.env.AIRTABLE_URL as string,
	COINPAPRIKA_URL: process.env.COINPAPRIKA_URL as string,
	DEEPL_API_KEY: process.env.DEEPL_API_KEY as string,
	SENTRY_DSN: process.env.SENTRY_DSN as string,
	API_KEY: process.env.API_KEY as string,
	ACCESS_KEY: process.env.ACCESS_KEY as string,
	SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY as string,
	REGION: process.env.REGION as string,
	SES_SENDER: process.env.SES_SENDER as string,
};

Object.entries(env).forEach(([key, value]) => {
	if (!value) {
		throw new Error(`Required environment variable '${key}' is missing!`);
	}
});

export default env;
