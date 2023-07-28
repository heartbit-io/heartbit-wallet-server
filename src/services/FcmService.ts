import * as Sentry from '@sentry/node';
import UserRepository from '../Repositories/UserRepository';
import admin from '../config/firebase-config';
import logger from '../util/logger';

class FcmService {
	async sendNotification(
		userId: number,
		title: string,
		message: string,
		data?: any,
	) {
		try {
			const userFcmToken = await UserRepository.getUserFcmToken(userId);
			if (!userFcmToken) return;

			const payload = {
				token: userFcmToken.fcmToken,
				notification: {
					title,
					body: message,
				},
				data,
			};

			await admin.messaging().send(payload);
		} catch (error) {
			Sentry.captureMessage(`FCM error: ${error}`);
			logger.warn(error);
		}
	}
}

export default new FcmService();
