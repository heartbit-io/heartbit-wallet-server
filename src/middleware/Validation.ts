import * as Sentry from '@sentry/node';

import {NextFunction, Request, Response} from 'express';

import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import {validationResult} from 'express-validator';

class Validation {
	validate(req: Request, res: Response, next: NextFunction) {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			Sentry.captureMessage(
				`Validation error: ${error
					.array()
					.map(e => e.msg)
					.join(', ')}
				`,
			);
			return res
				.status(HttpCodes.BAD_REQUEST)
				.json(
					new FormatResponse(false, HttpCodes.BAD_REQUEST, error.array(), null),
				);
		}
		next();
	}
}
export default new Validation();
