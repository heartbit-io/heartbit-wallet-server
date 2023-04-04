import {config} from 'dotenv';
import express, {Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {log} from 'console';
import dbconnection from './util/dbconnection';
import {routes} from './routes';

config();

if (!process.env.PORT) {
	log('Please set server port');
	process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Application = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// handle cors
app.use((_req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token',
	);
	next();
});

app.use(routes);

try {
	app.listen(PORT, async () => {
		await dbconnection.authenticate();
		log('connected to database');
		log(`Listening on port ${PORT}`);
	});
} catch (error) {
	log(error);
}

export default app;
