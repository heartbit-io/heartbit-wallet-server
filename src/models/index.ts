import {Dialect, Sequelize} from 'sequelize';

import {QuestionInstance} from './QuestionModel';
import {ReplyInstance} from './ReplyModel';
import {TransactionInstance} from './TransactionModel';
import {UserInstance} from './UserModel';
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
	QuestionInstance,
	UserInstance,
	TransactionInstance,
	ReplyInstance,
};

Object.values(db).forEach((model: any) => {
	if (model.associate) {
		model.associate(db);
	}
});

QuestionInstance.belongsTo(UserInstance, {
	as: 'User',
	onDelete: 'CASCADE',
	foreignKey: 'userId',
});

UserInstance.hasMany(QuestionInstance, {
	as: 'Questions',
	onDelete: 'CASCADE',
	foreignKey: 'userId',
});
