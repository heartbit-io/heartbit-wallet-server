import {NextFunction, Request, Response} from 'express';

import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import admin from '../config/firebase-config';
import { config } from 'dotenv';
import { UserRoles } from '../util/enums';

config();

export interface DoctorRequest extends Request {
    email?: string;
    role?: string;
}

class Auth {
	async verifyToken(req: DoctorRequest, res: Response, next: NextFunction) {
		const token = req?.headers?.authorization?.split(' ')[1] || '';

		try {
			const decodeValue = await admin.auth().verifyIdToken(token);

			if (decodeValue && decodeValue.email && decodeValue.role== UserRoles.DOCTOR) {
                req.email = decodeValue.email;
                req.role = decodeValue.role;
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
