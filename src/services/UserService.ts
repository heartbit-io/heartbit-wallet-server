import TransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import UserRepository from '../Repositories/UserRepository';
import {UserAttributes} from '../domains/entities/User';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
// import dbconnection from '../util/dbconnection';
import {TxTypes} from '../util/enums';
import {firebase} from '../config/firebase-config';

class UserService {
	async createUser(user: UserAttributes) {
		// todo[tvpeter]: add transaction
		// const dbTransaction = await dbconnection.transaction();

		try {
			const createdUser = await UserRepository.createUser(
				{
					...user,
					pubkey: user.pubkey.toLowerCase(),
					email: user.email.toLowerCase(),
				},
				// dbTransaction,
			);

			await TransactionsRepository.createTransaction(
				{
					amount: 1000, // SIGN_UP_BONUS
					toUserPubkey: user.pubkey,
					fromUserPubkey: user.pubkey, // Initial transcation
					type: TxTypes.SIGN_UP_BONUS,
					fee: 0,
				},
				// dbTransaction,
			);

			// await dbTransaction.commit();
			return createdUser;
		} catch (error: any) {
			// await dbTransaction.rollback();
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
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
			console.log(user);
			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			const response = user.dataValues;

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
