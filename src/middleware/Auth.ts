import {NextFunction, Request, Response} from 'express';

import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import admin from '../config/firebase-config';

class Auth {
	async verifyToken(req: Request, res: Response, next: NextFunction) {
		// Firebase using JWT, 'Bearer xxxxxxxxx~~'
		const token = req?.headers?.authorization?.split(' ')[1] || '';

		try {
			const decodeValue = await admin.auth().verifyIdToken(token);

			if (decodeValue) return next();

			return res.json(
				new FormatResponse(false, HttpCodes.UNAUTHORIZED, 'Unauthorized', null),
			);
		} catch (error) {
			return res.json(
				new FormatResponse(false, HttpCodes.INTERNAL_SERVER_ERROR, error, null),
			);
		}
	}
}

export default new Auth();
