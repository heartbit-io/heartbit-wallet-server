import UserRepository from '../Repositories/UserRepository';
import admin from '../config/firebase-config';

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
			console.error('FCM Error:', error);
		}
	}
}

export default new FcmService();
