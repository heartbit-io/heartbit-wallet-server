import * as Sentry from '@sentry/node';
import {NextFunction, Request, Response} from 'express';
import {HttpCodes} from '../util/HttpCodes';
import ResponseDto from '../dto/ResponseDTO';
import admin from '../config/firebase-config';
import {env} from '../config/env';

export interface DecodedRequest extends Request {
	email?: string;
	apikey?: string;
}

class Auth {
	verifyApiKey(req: DecodedRequest, res: Response, next: NextFunction) {
		const isVerified = req?.headers?.apikey === env.API_KEY;
		if (isVerified) return next();

		Sentry.captureMessage(`[${HttpCodes.UNAUTHORIZED}] Unauthorized - API Key`);
		return res
			.status(HttpCodes.UNAUTHORIZED)
			.json(
				new ResponseDto(
					false,
					HttpCodes.UNAUTHORIZED,
					'Unauthorized - API Key',
					null,
				),
			);
	}

	async verifyToken(req: DecodedRequest, res: Response, next: NextFunction) {
		if (process.env.NODE_ENV === 'test') {
			req.email = 'testemail@heartbit.io';
			return next();
		}

		const token = req?.headers?.authorization?.split(' ')[1] || '';

		try {
			const decodeValue = await admin.auth().verifyIdToken(token);

			if (decodeValue && decodeValue.email) {
				req.email = decodeValue.email;
				return next();
			}

			Sentry.captureMessage(`[${HttpCodes.UNAUTHORIZED}] Unauthorized - Token`);
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new ResponseDto(
						false,
						HttpCodes.UNAUTHORIZED,
						'Unauthorized - Token',
						null,
					),
				);
		} catch (error) {
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(false, HttpCodes.INTERNAL_SERVER_ERROR, error, null),
				);
		}
	}
}

export default new Auth();
