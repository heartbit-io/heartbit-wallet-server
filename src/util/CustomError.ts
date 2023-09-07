import {HttpCodes} from './HttpCodes';
import * as Sentry from '@sentry/node';

export class CustomError {
	code: HttpCodes;
	message: string;

	constructor(code: HttpCodes, message: string) {
		this.code = code;
		this.message = message;
		this.logToSentry();
	}

	logToSentry() {
		Sentry.captureMessage(`[${this.code}] ${this.message}`);
	}
}
