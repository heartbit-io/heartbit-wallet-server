import {Request, Response} from 'express';
import ChatgptService from '../services/ChatgptService';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import UserService from '../services/UserService';
import {DecodedRequest} from '../middleware/Auth';

class QuestionsController {
	async create(req: DecodedRequest, res: Response): Promise<Response<FormatResponse>> {
		try {

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

			const email = req.email;

			const user_open_bounty = await QuestionService.sumUserOpenBountyAmount(
				email,
			);

			const user_open_bounty_total = user_open_bounty[0]
				? user_open_bounty[0].dataValues.total_bounty
				: 0;

			const total_bounty =
				Number(user_open_bounty_total) + Number(req.body.bounty_amount);

			const user_balance = await UserService.getUserBalance(req.email);

			if (!user_balance) {
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

			if (total_bounty >= Number(user_balance.btc_balance)) {
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

			const question = await QuestionService.create({...req.body, user_email: email});

			const model = 'gpt-3.5-turbo';
			const maxTokens = 2048;
			await ChatgptService.create(
				question.id,
				question.content,
				model,
				maxTokens,
			);

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

	async delete(req: DecodedRequest, res: Response): Promise<Response<FormatResponse>> {
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

			const email = req.email;

			if (question.user_email !== email) {
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

	async getAllQuestions(
		req: Request,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const limit = (req.query.limit as number | undefined) || 50;
			const offset = req.query.offset as number | undefined;

			const questions = await QuestionService.getAll(limit, offset);

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

	async getOpenQuestionsOrderByBounty(req: Request, res: Response) {
		try {
			const questions = await QuestionService.getOpenQuestionsOrderByBounty();

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved all open questions',
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
				req.body.user_email,
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
