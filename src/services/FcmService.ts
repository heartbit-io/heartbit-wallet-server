import * as Sentry from '@sentry/node';
import UserRepository from '../Repositories/UserRepository';
import admin from '../config/firebase-config';
import logger from '../util/logger';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';

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
					data,
					body: message,
				},
			};

			return admin.messaging().send(payload);
		} catch (error) {
			Sentry.captureMessage(`FCM error: ${error}`);
			logger.warn(error);
		}
	}
	async updateUserFcmToken(fcmToken: string, email: string | undefined) {
		if (!email)
			throw new CustomError(HttpCodes.UNAUTHORIZED, 'User not logged in');

		const updateFcmToken = await UserRepository.updateUserFcmToken(
			fcmToken,
			email,
		);
		if (!updateFcmToken)
			throw new CustomError(
				HttpCodes.BAD_REQUEST,
				'Error updating user fcm token',
			);
		return await UserRepository.getUserDetailsByEmail(email);
	}
}

export default new FcmService();
