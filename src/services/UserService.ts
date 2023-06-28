import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

import BtcTransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import {TxTypes} from '../util/enums';
import {UserAttributes} from '../domains/entities/User';
import UserRepository from '../Repositories/UserRepository';
import dataSource from '../domains/repo';
import {firebase} from '../config/firebase-config';

class UserService {
	async createUser(user: UserAttributes) {
		const emailToLowerCase = user.email.toLowerCase();
		const pubkeyToLowerCase = user.pubkey.toLowerCase();
		const isExsist = await UserRepository.getUserDetailsByEmail(
			emailToLowerCase,
		);
		// XXX(david): Pass in the logic to create the user if it exists.
		// Because we have only 1 process to sign up and sign in.
		if (isExsist) return isExsist;

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

	async login(email: string, password: string) {
		try {
			const login = await signInWithEmailAndPassword(
				getAuth(firebase),
				email,
				password,
			);

			if (!login.user.emailVerified)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'User email is not verified',
				);

			if (!login.user)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Invalid user email/password',
				);

			const token = await login.user.getIdToken();

			const data = {
				token,
				uid: login.user.uid,
				email: login.user.email,
				emailVerified: login.user.emailVerified,
			};

			return data;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
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
