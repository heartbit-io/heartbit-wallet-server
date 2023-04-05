import {Request, Response} from 'express';
import {QuestionInstance} from '../models/QuestionModel';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';

class QuestionsController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const question = await QuestionInstance.create({
				...req.body,
			});

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

	async delete(req: Request, res: Response): Promise<Response<FormatResponse>> {
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

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved question details',
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

	async updateQuestion(req: Request, res: Response) {
		try {
			const {questionId} = req.params;

			const question = await QuestionInstance.findOne({
				where: {id: questionId, pubkey: req.body.pubkey, status: "Open"},
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

			const updatedQuestion = await question.update({
        status: req.body.status,
        content: req.body.content,
        bounty_amount: req.body.bounty_amount,
        image: req.body.image
      });
      
      return res.status(HttpCodes.OK)
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
