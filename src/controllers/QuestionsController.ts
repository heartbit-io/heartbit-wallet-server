import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import {QuestionStatus} from '../util/enums';
import {Response} from 'express';
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
					new ResponseDto(
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

			await QuestionService.deleteQuestion(Number(questionId), req.email);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Question deleted successfully',
						null,
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

	//get user questions and their status
	async getAllQuestions(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const limit = req.query.limit ? Number(req.query.limit) : 20;
			const offset = req.query.offset ? Number(req.query.offset) : 0;
			const order = req.query.order as 'ASC' | 'DESC' | undefined;

			const result = await QuestionService.getAll(
				req.email,
				limit,
				offset,
				order,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						`Successfully retrieved all user questions according to: limit: ${limit}, offset: ${offset}, order: ${order}`,
						result,
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

	//get user open questions
	async getOpenQuestionsOrderByBounty(req: DecodedRequest, res: Response) {
		try {
			const index = req.query.index ? Number(req.query.index) : 0;
			const questions = await QuestionService.getOpenQuestionsOrderByBounty(
				index,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Successfully retrieved open questions',
						questions,
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

	async getUserQuestionsByStatus(req: DecodedRequest, res: Response) {
		try {
			const status = req.query.status as QuestionStatus;

			const questions = await QuestionService.getUserQuestionsByStatus(
				req.email,
				status,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Successfully retrieved all user open questions',
						questions,
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
	async getQuestion(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;
			const question = await QuestionService.getQuestion(
				Number(questionId),
				req.email,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Successfully retrieved question details',
						question,
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
}

export default new QuestionsController();
