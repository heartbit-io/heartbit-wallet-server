import * as Sentry from '@sentry/node';
import {HttpCodes} from '../util/HttpCodes';

class ResponseDto<T> {
	success: boolean;

	statusCode: HttpCodes;

	message: string;

	data: T;

	constructor(
		success: boolean,
		statusCode: HttpCodes,
		message: string | any,
		data: T,
	) {
		this.success = success;
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
		if (!this.success) {
			this.logToSentry();
		}
	}

	logToSentry() {
		Sentry.captureMessage(`[${this.statusCode}] ${this.message}`);
	}
}

export default ResponseDto;
