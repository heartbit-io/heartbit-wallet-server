import BtcTransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import {TxTypes} from '../util/enums';
import {UserAttributes} from '../domains/entities/User';
import UserRepository from '../Repositories/UserRepository';
import dataSource from '../domains/repo';

class UserService {
	async createUser(user: UserAttributes) {
		const emailToLowerCase = user.email.toLowerCase();
		const pubkeyToLowerCase = user.pubkey.toLowerCase();
		const isExsist = await UserRepository.getUserDetailsByEmail(
			emailToLowerCase,
		);
		if (isExsist) {
			return isExsist;
		}
		const querryRunner = dataSource.createQueryRunner();
		await querryRunner.connect();
		await querryRunner.startTransaction('REPEATABLE READ');

		try {
			const createdUser = await UserRepository.createUser({
				...user,
				pubkey: pubkeyToLowerCase,
				email: emailToLowerCase,
				promotionBtcBalance: 1000, // SIGN_UP_BONUS
			});
			await BtcTransactionsRepository.createTransaction({
				amount: 1000, // SIGN_UP_BONUS
				toUserPubkey: pubkeyToLowerCase,
				fromUserPubkey: pubkeyToLowerCase, // Initial transcation
				type: TxTypes.SIGN_UP_BONUS,
				fee: 0,
			});
			await querryRunner.commitTransaction();
			return {
				...createdUser,
				btcBalance:
					Number(createdUser.btcBalance) +
					Number(createdUser.promotionBtcBalance),
				withdrawableBtcBalance: createdUser.btcBalance,
			};
		} catch (error: any) {
			await querryRunner.rollbackTransaction();
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		} finally {
			await querryRunner.release();
		}
	}

	async getUser(email: string | undefined) {
		try {
			if (!email)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Error getting user email',
				);

			const user = await UserRepository.getUserDetailsByEmail(email);
			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			return {
				...user,
				btcBalance: Number(user.btcBalance) + Number(user.promotionBtcBalance),
				withdrawableBtcBalance: user.btcBalance,
			};
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
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

	async deleteUserFcmToken(email: string | undefined) {
		if (!email)
			throw new CustomError(HttpCodes.UNAUTHORIZED, 'User not logged in');

		const deleted = await UserRepository.deleteUserFcmToken(email);
		if (!deleted)
			throw new CustomError(
				HttpCodes.BAD_REQUEST,
				'Error deleting user fcm token',
			);
		return await UserRepository.getUserDetailsByEmail(email);
	}
}

export default new UserService();
