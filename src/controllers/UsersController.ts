import {Request, Response} from 'express';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
import {UserInstance} from '../models/UserModel';
import {QuestionInstance} from '../models/QuestionModel';
import {ReplyInstance} from '../models/ReplyModel';
import { TransactionInstance } from '../models/TransactionModel';

class UsersController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const question = await UserInstance.create({
				...req.body,
			});

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

			const user = await UserInstance.findOne({
				where: {pubkey},
			});

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

			//get user questions
			const questions = await QuestionInstance.findAll({
				where: {user_pubkey: pubkey},
			});
			const replies = await ReplyInstance.findAll({
				where: {user_pubkey: pubkey},
            });
            
            const transactions = await TransactionInstance.findAll({ where: { from_user_pubkey: pubkey } });

			const response = {...user.dataValues, questions, replies, transactions};

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
