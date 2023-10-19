import BtcTransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import {User, UserAttributes} from '../domains/entities/User';
import UserRepository from '../Repositories/UserRepository';
import UserRegisteredEventListener from '../listeners/UserRegisteredListener';
import DoctorProfileRepository from '../Repositories/DoctorProfileRepository';
import QuestionRepository from '../Repositories/QuestionRepository';
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

		const checkDeletedUser = await UserRepository.getDeletedAccountByEmail(
			emailToLowerCase,
		);

		if (checkDeletedUser) {
			return await this.restoreAndUpdateUserAccount(
				user,
				pubkeyToLowerCase,
				emailToLowerCase,
				checkDeletedUser,
			);
		}

		/**
		 * const querryRunner = dataSource.createQueryRunner();
			await querryRunner.connect();
			await querryRunner.startTransaction('REPEATABLE READ');
			**/

		try {
			const createdUser = await UserRepository.createUser({
				...user,
				pubkey: pubkeyToLowerCase,
				email: emailToLowerCase,
				promotionBtcBalance: 0, // SIGN_UP_BONUS
			});

			/**
			 * await BtcTransactionsRepository.createTransaction({
				amount: 0, // SIGN_UP_BONUS
				toUserPubkey: pubkeyToLowerCase,
				fromUserPubkey: pubkeyToLowerCase, // Initial transcation
				type: TxTypes.SIGN_UP_BONUS,
				fee: 0,
			});
			**/

			//AWS SES
			UserRegisteredEventListener.emit('newUserRegistered', emailToLowerCase);

			// await querryRunner.commitTransaction();
			return {
				...createdUser,
				btcBalance:
					Number(createdUser.btcBalance) +
					Number(createdUser.promotionBtcBalance),
				withdrawableBtcBalance: createdUser.btcBalance,
			};
		} catch (error: any) {
			// await querryRunner.rollbackTransaction();
			throw new CustomError(HttpCodes.INTERNAL_SERVER_ERROR, error);
		}
		//finally {
		// await querryRunner.release();
		//}
	}

	private async restoreAndUpdateUserAccount(
		user: UserAttributes,
		pubkeyToLowerCase: string,
		emailToLowerCase: string,
		checkDeletedUser: User,
	) {
		const newUserDetails = {
			...user,
			pubkey: pubkeyToLowerCase,
			email: emailToLowerCase,
			deletedAt: null,
		};

		const updatedUser = await UserRepository.restoreAndUpdateAccount(
			checkDeletedUser.id,
			newUserDetails,
		);

		if (!updatedUser) {
			throw new CustomError(
				HttpCodes.INTERNAL_SERVER_ERROR,
				'Error restoring user account',
			);
		}

		const restoredUser = await UserRepository.getUserDetailsByEmail(
			emailToLowerCase,
		);

		return restoredUser;
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
			throw new CustomError(HttpCodes.INTERNAL_SERVER_ERROR, error);
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

	async deleteUserAccount(id: number) {
		const user = await UserRepository.getUserDetailsById(id);
		if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

		await BtcTransactionsRepository.deleteUserTransactions(user.email);

		await QuestionRepository.deleteUserQuestions(id);
		//delete user profile
		if (user.isDoctor()) {
			await DoctorProfileRepository.deleteDoctorProfile(id);
		}

		const deleted = await UserRepository.deleteUserAccount(id);
		if (!deleted)
			throw new CustomError(
				HttpCodes.BAD_REQUEST,
				'Error deleting user account',
			);
		return deleted;
	}
}

export default new UserService();
