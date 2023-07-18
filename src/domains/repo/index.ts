import {BtcTransaction} from '../entities/BtcTransaction';
import {ChatGptReply} from '../entities/ChatGptReply';
import {DataSource} from 'typeorm';
import {Question} from '../entities/Question';
import {Reply} from '../entities/Reply';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {User} from '../entities/User';
import {DoctorQuestion} from '../entities/DoctorQuestion';
import env from '../../config/env';

const dataSource = new DataSource({
	type: env.DB_DRIVER as 'postgres',
	host: env.DB_HOST,
	username: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.NODE_ENV === 'production' ? env.DB_NAME : env.TEST_DB_NAME,
	logging: false,
	synchronize: env.NODE_ENV === 'production' ? false : true,
	namingStrategy: new SnakeNamingStrategy(),
	entities: [
		User,
		Reply,
		BtcTransaction,
		ChatGptReply,
		Question,
		DoctorQuestion,
	],
	// migrations: ['src/migrations/*.ts'],
});

export const userDataSource = dataSource.getRepository(User);
export const ReplyDataSource = dataSource.getRepository(Reply);
export const BtcTransactionDataSource =
	dataSource.getRepository(BtcTransaction);
export const ChatGPTDataSource = dataSource.getRepository(ChatGptReply);
export const QuestionDataSource = dataSource.getRepository(Question);
export const DoctorQuestionDataSource =
	dataSource.getRepository(DoctorQuestion);

export default dataSource;
