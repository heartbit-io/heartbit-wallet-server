import {DataSource} from 'typeorm';
import env from '../../config/env';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';

const dataSource = new DataSource({
	type: env.DB_DRIVER as 'postgres',
	host: env.DB_HOST,
	username: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.NODE_ENV === 'production' ? env.DB_NAME : env.TEST_DB_NAME,
	logging: true,
	synchronize: env.NODE_ENV === 'production' ? false : true,
	namingStrategy: new SnakeNamingStrategy(),
});

export default dataSource;
