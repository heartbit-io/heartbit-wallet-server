import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import BtcTransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import {TxTypes} from '../util/enums';
import {User, UserAttributes} from '../domains/entities/User';
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
			});

			await BtcTransactionsRepository.createTransaction({
				amount: 1000, // SIGN_UP_BONUS
				toUserPubkey: pubkeyToLowerCase,
				fromUserPubkey: pubkeyToLowerCase, // Initial transcation
				type: TxTypes.SIGN_UP_BONUS,
				fee: 0,
			});
			await querryRunner.commitTransaction();
			return createdUser;
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

			const response = user;

			return response;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}
}

export default new UserService();
