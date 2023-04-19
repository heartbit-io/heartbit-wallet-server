import * as dotenv from 'dotenv';
import {Dialect, Sequelize} from 'sequelize';
import {log} from 'console';
import {QuestionInstance} from './QuestionModel';
import {UserInstance} from './UserModel';
import {TransactionInstance} from './TransactionModel';
import {ReplyInstance} from './ReplyModel';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import config from '../config/config';

dotenv.config();

const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER as Dialect;
const dbPassword = process.env.DB_PASSWORD;
const testDbName = process.env.TEST_DB_NAME as string;

if (!dbName || !dbUser || !dbHost || !dbDriver || !dbPassword) {
	log('Please ensure that you set the database connection parameters');
	process.exit(1);
}

const dbToUse = process.env.NODE_ENV === 'test' ? testDbName : dbName;

const sequelize = new Sequelize(dbToUse, dbUser, dbPassword, {
	host: dbHost,
	dialect: dbDriver,
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

// Object.values(db).forEach((model: any) => {
// 	if (model.associate) {
// 		model.associate(db);
// 	}
// });

QuestionInstance.belongsTo(UserInstance, {
	as: 'User',
	onDelete: 'CASCADE',
	foreignKey: 'user_pubkey',
});

UserInstance.hasMany(QuestionInstance, {
	as: 'Questions',
	onDelete: 'CASCADE',
	foreignKey: 'user_pubkey',
});
