import * as Sentry from '@sentry/node';

import {NextFunction, Request, Response} from 'express';

import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import admin from '../config/firebase-config';
import {config} from 'dotenv';

config();

export interface DecodedRequest extends Request {
	email?: string;
}

class Auth {
	async verifyToken(req: DecodedRequest, res: Response, next: NextFunction) {
		const token = req?.headers?.authorization?.split(' ')[1] || '';

		try {
			const decodeValue = await admin.auth().verifyIdToken(token);

			if (decodeValue) {
				req.email = decodeValue.email;
				return next();
			}

			Sentry.captureMessage(`[${HttpCodes.UNAUTHORIZED}] Unauthorized`);
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'Unauthorized',
						null,
					),
				);
		} catch (error) {
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new FormatResponse(
						false,
						HttpCodes.INTERNAL_SERVER_ERROR,
						error,
						null,
					),
				);
		}
	}
}

export default new Auth();
