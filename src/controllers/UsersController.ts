import {Request, Response} from 'express';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
import ReplyService from '../services/ReplyService';
import QuestionService from '../services/QuestionService';
import TransactionService from '../services/TransactionService';
import UserService from '../services/UserService';

class UsersController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const question = await UserService.createUser({...req.body});

			return res
				.status(HttpCodes.CREATED)
				.json(
					new FormatResponse(
						true,
						HttpCodes.CREATED,
						'User created successfully',
						question,
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
		req: Request,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {pubkey} = req.params;

			const user = await UserService.getUserDetails(pubkey);

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

			const user_questions = await QuestionService.getUserQuestions(pubkey);
			const user_replies = await ReplyService.getUserReplies(pubkey);
			const user_transactions = await TransactionService.getUserTransactions(
				pubkey,
			);

			const response = {
				...user.dataValues,
				questions: user_questions,
				replies: user_replies,
				transactions: user_transactions,
			};

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
