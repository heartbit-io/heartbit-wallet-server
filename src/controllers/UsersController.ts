import {Request, Response} from 'express';

import BtcTransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import ResponseDto from '../dto/ResponseDTO';
import {TxTypes} from '../util/enums';
import UserRepository from '../Repositories/UserRepository';
import UserService from '../services/UserService';

class UsersController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		const user = req.body;
		const emailToLowerCase = user.email.toLowerCase();
		const pubkeyToLowerCase = user.pubkey.toLowerCase();
		const isExsist = await UserRepository.getUserDetailsByEmail(
			emailToLowerCase,
		);

		// TODO(david): add transaction
		// const dbTransaction = await dbconnection.transaction();

		try {
			if (isExsist) {
				// XXX(david): refactoring
				// Pass in the logic to create the user if it exists.
				// Because we have only 1 process to sign up and sign in.

				return res
					.status(HttpCodes.OK)
					.json(
						new ResponseDto(
							true,
							HttpCodes.OK,
							'User logged in successfully',
							null,
						),
					);
			} else {
				const createdUser = await UserRepository.createUser(
					{
						...user,
						pubkey: pubkeyToLowerCase,
						email: emailToLowerCase,
					},
					// dbTransaction,
				);
				await BtcTransactionsRepository.createTransaction(
					{
						amount: 1000, // SIGN_UP_BONUS
						toUserPubkey: pubkeyToLowerCase,
						fromUserPubkey: pubkeyToLowerCase, // Initial transcation
						type: TxTypes.SIGN_UP_BONUS,
						fee: 0,
					},
					// dbTransaction,
				);

				// await dbTransaction.commit();
				return res
					.status(HttpCodes.OK)
					.json(
						new ResponseDto(
							true,
							HttpCodes.OK,
							'User sign up in successfully',
							createdUser,
						),
					);
			}
		} catch (error: any) {
			return res
				.status(error.code ? error.code : HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(
						false,
						error.code ? error.code : HttpCodes.INTERNAL_SERVER_ERROR,
						error.message ? error.message : 'HTTP error',
						null,
					),
				);
		}
	}

	async login(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const {email, password} = req.body;

			const loginData = await UserService.login(email, password);
			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'User logged in successfully',
						loginData,
					),
				);
		} catch (error: any) {
			return res
				.status(error.code ? error.code : HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(
						false,
						error.code ? error.code : HttpCodes.INTERNAL_SERVER_ERROR,
						error.message ? error.message : 'HTTP error',
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
			const user = await UserService.getUser(req.email);

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved user details',
						user,
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
