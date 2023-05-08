import {Request, Response} from 'express';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';

import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import TransactionService from '../services/TransactionService';
import {TxTypes} from '../util/enums';
import UserService from '../services/UserService';
import dbconnection from '../util/dbconnection';
import {firebase} from '../config/firebase-config';

class UsersController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		const dbTransaction = await dbconnection.transaction();

		try {
			const user = await UserService.createUser(
				{
					...req.body,
					pubkey: req.body.pubkey.toLowerCase(),
					email: req.body.email.toLowerCase(),
				},
				dbTransaction,
			);

			await TransactionService.createTransaction(
				{
					amount: 1000, // SIGN_UP_BONUS
					toUserPubkey: user.pubkey,
					fromUserPubkey: user.pubkey, // Initial transcation
					type: TxTypes.SIGN_UP_BONUS,
					fee: 0,
				},
				dbTransaction,
			);

			await dbTransaction.commit();

			return res
				.status(HttpCodes.CREATED)
				.json(
					new FormatResponse(
						true,
						HttpCodes.CREATED,
						'User created successfully',
						user,
					),
				);
		} catch (error) {
			await dbTransaction.rollback();

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

	async login(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const {email, password} = req.body;

			const login = await signInWithEmailAndPassword(
				getAuth(firebase),
				email,
				password,
			);

			if (!login.user.emailVerified) {
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'User email is not verified',
							null,
						),
					);
			}

			if (!login.user) {
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'User email or password is incorrect',
							null,
						),
					);
			}

			const token = await login.user.getIdToken();

			const data = {
				token,
				uid: login.user.uid,
				email: login.user.email,
				emailVerified: login.user.emailVerified,
			};

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'User logged in successfully',
						data,
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

	async getUser(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			if (!req.params.email) {
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'Error getting user email',
							null,
						),
					);
			}

			const emailByToken = req.email;
			const email = req.params.email.toLocaleLowerCase();

			if (emailByToken !== email) {
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'Unauthorized to get user details',
							null,
						),
					);
			}

			const user = await UserService.getUserDetailsByEmail(email);

			if (!user) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'User was not found',
							null,
						),
					);
			}

			const response = user.dataValues;

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved user details',
						response,
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

export default new UsersController();
