import * as Sentry from '@sentry/node';

import {NextFunction, Request, Response} from 'express';
import {logger} from '@sentry/utils';
import {HttpCodes} from './HttpCodes';
import admin from 'firebase-admin';
import ResponseDto from '../dto/ResponseDTO';

class FBUtil {
	static async verifyKeyAndToken(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		const token = req?.headers?.authorization?.split(' ')[1] as string;

		try {
			const user = await admin.auth().verifyIdToken(token);
			if (user.email_verified) return next();

			// if not authorized, check who he is
			console.log(user.email);
			logger.log(user.email);

			Sentry.captureMessage(`[${HttpCodes.UNAUTHORIZED}] Unauthorized`);

			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new ResponseDto(false, HttpCodes.UNAUTHORIZED, 'Unauthorized', null),
				);
		} catch (err) {
			console.error(err);
			logger.error(err);

			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${err}`);

			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(false, HttpCodes.INTERNAL_SERVER_ERROR, err, null),
				);
		}
	}

	static async sendNotification(
		token: string,
		title: string,
		message: string,
		data: any,
	) {
		try {
			const payload = {
				token,
				data,
				notification: {
					title,
					body: message,
				},
			};

			await admin.messaging().send(payload);
		} catch (error) {
			Sentry.captureMessage(`FCM Error: ${error}`);
			console.error('FCM Error:', error);
		}
	}
}

export default FBUtil;
