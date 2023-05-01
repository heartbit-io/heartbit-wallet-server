import { Response} from 'express';

import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import UserService from '../services/UserService';
import { QuestionStatus } from '../models/QuestionModel';

class QuestionsController {
	async create(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			if (!req.email) {
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

			const user = await UserService.getUserDetailsByEmail(req.email);

			if (!user) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Error getting user email',
							null,
						),
					);
			}

			const userId: number = user.id;

			const userOpenBounty = await QuestionService.sumUserOpenBountyAmount(
				userId,
			);

			const userOpenBountyTotal = userOpenBounty[0]
				? userOpenBounty[0].dataValues.totalBounty
				: 0;

			const totalBounty =
				Number(userOpenBountyTotal) + Number(req.body.bountyAmount);

			const userBalance = await UserService.getUserBalance(userId);

			if (!userBalance) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Error getting user balance',
							null,
						),
					);
			}

			if (totalBounty >= Number(userBalance.btcBalance)) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'You do not have enough sats to post a new question',
							null,
						),
					);
			}

			const question = await QuestionService.create({...req.body, userId});

			return res
				.status(HttpCodes.CREATED)
				.json(
					new FormatResponse(
						true,
						HttpCodes.CREATED,
						'Question posted successfully',
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

	async delete(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;

			const question = await QuestionService.getQuestion(Number(questionId));

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

			if (!req.email) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Error getting user email',
							null,
						),
					);
			}

			const user = await UserService.getUserDetailsByEmail(req.email);

			if (!user) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Error getting user email',
							null,
						),
					);
			}

			const userId: number = user.id;

			if (question.userId !== userId) {
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'Only users who posted a question can delete the question',
							null,
						),
					);
			}

			await question.destroy();

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Question deleted successfully',
						null,
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

	//get user questions and their status
	async getAllQuestions(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const limit = (req.query.limit as number | undefined) || 50;
			const offset = req.query.offset as number | undefined;
			const order = (req.query.order as string | undefined) || 'DESC';

			if (!req.email) {
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

			const user = await UserService.getUserDetailsByEmail(req.email);

			if (!user) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Error getting user email',
							null,
						),
					);
			}

			const userId: number = user.id;

			const questions = await QuestionService.getAll(
				userId,
				limit,
				offset,
				order,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						`Successfully retrieved all user questions according to: limit: ${limit}, offset: ${limit}, order: ${order}`,
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

	//get user open questions
	async getOpenQuestionsOrderByBounty(req: DecodedRequest, res: Response) {
		try {
			const questions = await QuestionService.getOpenQuestionsOrderByBounty();

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved all user open questions',
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

	async getUserQuestionsByStatus(req: DecodedRequest, res: Response) { 
		try {
			if (!req.email) { 
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
			const { email } = req;

			const user = await UserService.getUserDetailsByEmail(email);

			if (!user) { 
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Error getting user details',
							null,
						),
					);
			}

			const status = req.query.status as QuestionStatus;

			const questions = await QuestionService.getUserQuestionsByStatus(user.id, status);

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved all user open questions',
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
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;

			const question = await QuestionService.getQuestion(Number(questionId));
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

			if (!req.email) {
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

			const user = await UserService.getUserDetailsByEmail(req.email);

			if (!user) { 
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Error getting user details',
							null,
						),
					);
			}


			// TODO: check if user is admin or doctor
			if (question.userId !== user.id && !user.isDoctor) { 
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'Only users who posted a question can view the question',
							null,
						),
					);
			}

			const replies = await ReplyService.getQuestionReplies(Number(questionId));

			const response = {...question.dataValues, replies};

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

	async updateQuestion(req: DecodedRequest, res: Response) {
		try {
			const {questionId} = req.params;

			const question = await QuestionService.getUserOpenQuestion(
				Number(questionId),
				req.body.userId,
			);

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

export default new QuestionsController();
