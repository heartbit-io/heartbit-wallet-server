import { config } from "dotenv";
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
};

Object.entries(env).forEach(([key, value]) => {
	if (!value) {
		throw new Error(`Required environment variable '${key}' is missing!`);
	}
});

export default env;
