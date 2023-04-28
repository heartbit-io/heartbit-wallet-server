import {NextFunction, Request, Response} from 'express';

import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import admin from '../config/firebase-config';
import {config} from 'dotenv';

config();

export interface DecodedRequest extends Request {
	id?: number;
}

class Auth {
	async verifyToken(req: DecodedRequest, res: Response, next: NextFunction) {
		const token = req?.headers?.authorization?.split(' ')[1] || '';

		// XXX, FIXFE(david): Under line Only for development, remove this line when mid-may
		if (process.env.NODE_ENV !== 'production') return next();

		try {
			const decodeValue = await admin.auth().verifyIdToken(token);

			if (decodeValue) {
				req.id = decodeValue.id;
				return next();
			}

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
