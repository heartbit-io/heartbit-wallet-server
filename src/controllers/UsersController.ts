import {Request, Response} from 'express';
import {QuestionInstance} from '../models/QuestionModel';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
import {ReplyInstance} from '../models/ReplyModel';
import { UserInstance } from '../models/UserModel';

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


	async getAllQuestions(
		req: Request,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const limit = (req.query.limit as number | undefined) || 50;
			const offset = req.query.offset as number | undefined;

			const questions = await QuestionInstance.findAll({
				where: {},
				limit,
				offset,
			});

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved all questions',
						questions,
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

	async getQuestion(
		req: Request,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;

			const question = await QuestionInstance.findOne({
				where: {id: questionId},
			});

			if (!question) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Question was not found',
							null,
						),
					);
			}

			const replies = await ReplyInstance.findAll({
				where: {question_id: questionId},
			});

			const response = {...question.dataValues,  replies};

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved question details',
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

	async updateQuestion(req: Request, res: Response) {
		try {
			const {questionId} = req.params;

			const question = await QuestionInstance.findOne({
				where: {
					id: questionId,
					user_pubkey: req.body.user_pubkey,
					status: 'Open',
				},
			});

			if (!question) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Check that the question exist and has not already been closed',
							null,
						),
					);
			}

			const updatedQuestion = await question.update({
				status: req.body.status,
			});

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully update question status',
						updatedQuestion,
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
