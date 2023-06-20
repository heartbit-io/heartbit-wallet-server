import {Dialect, Sequelize} from 'sequelize';

import env from '../config/env';

const dbToUse = env.NODE_ENV === 'test' ? env.TEST_DB_NAME : env.DB_NAME;

const sequelize = new Sequelize(dbToUse, env.DB_USER, env.DB_PASSWORD, {
	host: env.DB_HOST,
	dialect: env.DB_DRIVER as Dialect,
	logging: false,
});

const db = {
	sequelize,
	Sequelize,
};

Object.values(db).forEach((model: any) => {
	if (model.associate) {
		model.associate(db);
	}
});
