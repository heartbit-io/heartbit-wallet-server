import * as Sentry from '@sentry/node';

import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import {QuestionStatus} from '../models/QuestionModel';
import {Response} from 'express';
import UserService from '../services/UserService';
import ResponseDto from '../dto/ResponseDTO';

class QuestionsController {
	async create(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const newQuestion = await QuestionService.create(req.body, req.email);
			return res
				.status(HttpCodes.CREATED)
				.json(
					new FormatResponse(
						true,
						HttpCodes.CREATED,
						'Question posted successfully',
						newQuestion,
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

	async delete(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;

			const question = await QuestionService.getQuestion(Number(questionId));

			if (!question) {
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Question was not found`,
				);
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
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Error getting user email`,
				);
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Error getting user email',
							null,
						),
					);
			}

			const user = await UserService.getUserDetailsByEmail(req.email);

			if (!user) {
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Error getting user email`,
				);
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Error getting user email',
							null,
						),
					);
			}

			const userId: number = user.id;

			if (question.userId !== userId) {
				Sentry.captureMessage(
					`[${HttpCodes.UNAUTHORIZED}] Only users who posted a question can delete the question`,
				);
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
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
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
				Sentry.captureMessage(
					`[${HttpCodes.UNAUTHORIZED}] Error getting user email`,
				);
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
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Error getting user email`,
				);
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
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

			return res.status(HttpCodes.OK).json(
				new FormatResponse(
					true,
					HttpCodes.OK,
					`Successfully retrieved all user questions according to: limit: ${limit}, offset: ${limit}, order: ${order}`,
					questions.map(question => {
						return {
							...question.dataValues,
							content: question.dataValues.rawContent,
						};
					}),
				),
			);
		} catch (error) {
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
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
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
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
				Sentry.captureMessage(
					`[${HttpCodes.UNAUTHORIZED}] Error getting user email`,
				);
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
			const {email} = req;

			const user = await UserService.getUserDetailsByEmail(email);

			if (!user) {
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Error getting user details`,
				);
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Error getting user details',
							null,
						),
					);
			}

			const status = req.query.status as QuestionStatus;

			const questions = await QuestionService.getUserQuestionsByStatus(
				user.id,
				status,
			);

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
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
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
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Question was not found`,
				);
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
				Sentry.captureMessage(
					`[${HttpCodes.UNAUTHORIZED}] Error getting user email`,
				);
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
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Error getting user details`,
				);
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Error getting user details',
							null,
						),
					);
			}

			// TODO: check if user is admin or doctor
			if (question.userId !== user.id && !user.isDoctor) {
				Sentry.captureMessage(
					`[${HttpCodes.UNAUTHORIZED}] Only users who posted a question can view the question`,
				);
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

			const response = question.dataValues;
			response.content = response.rawContent;

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
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
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
				Sentry.captureMessage(
					`[${HttpCodes.NOT_FOUND}] Check that the question exist and has not already been closed`,
				);
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
			Sentry.captureMessage(`[${HttpCodes.INTERNAL_SERVER_ERROR}] ${error}`);
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
