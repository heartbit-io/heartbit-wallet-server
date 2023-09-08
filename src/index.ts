import * as Sentry from '@sentry/node';

import express, {Application} from 'express';

import cors from 'cors';
import dataSource from './domains/repo';
import env from './config/env';
import helmet from 'helmet';
import {log} from 'console';
import path from 'path';
import {routes} from './routes';

const PORT = Number(env.PORT);

const app: Application = express();

Sentry.init({
	dsn: env.SENTRY_DSN,
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({tracing: true}),
		// enable Express.js middleware tracing
		new Sentry.Integrations.Express({app}),
		// Automatically instrument Node.js libraries and frameworks
		...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
	],

	// Set tracesSampleRate to 1.0 to capture 100%
	// of transactions for performance monitoring.
	// We recommend adjusting this value in production
	tracesSampleRate: 1.0,

	// Don't capture local error
	enabled:
		process.env.NODE_ENV === 'production' ||
		process.env.NODE_ENV === 'development',
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, async () => {
	try {
		await dataSource.initialize();
		log('connected to database');
		log(`Listening on port ${PORT}`);
	} catch (error) {
		log(error);
	}
});

export default app;
