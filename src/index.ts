import express, {Application} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {log} from 'console';
import dbconnection from './util/dbconnection';
import { routes } from './routes';
import env from './config/env';


const PORT = Number(env.PORT);

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

app.use('/api/v1', routes);

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
