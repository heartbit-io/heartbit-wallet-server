import {createLogger, format, level, transports} from 'winston';

const logger = createLogger({
	level: 'error',
	format: format.json(),
	transports: [
		new transports.File({
			filename: 'logs/logs.log',
			format: format.combine(
				format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
				format.align(),
				format.printf(
					info => `${info.level}: ${[info.timestamp]}: ${info.message}`,
				),
			),
		}),
	],
});

export default logger;
