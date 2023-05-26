import {Op, Sequelize} from 'sequelize';
import {
	Question,
	QuestionAttributes,
	QuestionStatus,
} from '../models/QuestionModel';
import UserService from '../services/UserService';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import QuestionRepository from '../Repositories/QuestionRepository';
import DeeplService from './DeeplService';

class QuestionService {
	async create(question: QuestionAttributes, email: string | undefined) {
		try {
			if (!email)
				throw new CustomError(HttpCodes.BAD_REQUEST, 'Email is required');

			const user = await UserService.getUserDetailsByEmail(email);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			const userOpenBounty = await QuestionRepository.sumUserOpenBountyAmount(
				user.id,
			);

			const userOpenBountyTotal = userOpenBounty[0]
				? userOpenBounty[0].dataValues.totalBounty
				: 0;

			const totalBounty: number =
				Number(userOpenBountyTotal) + Number(question.bountyAmount);

			const userBtcBalance = user.get('btcBalance') as number;

			if (!userBtcBalance)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'Error getting user balance',
				);

			if (totalBounty > userBtcBalance) {
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'You do not have enough sats to post a new question',
				);
			}

			const enContent = await DeeplService.getTextTranslatedIntoEnglish(
				question.content,
			);

			const newQuestion = await QuestionRepository.create({
				...question,
				content: enContent.text,
				rawContentLanguage: enContent.detected_source_language, // snake case because deepl response
				rawContent: question.content,
				userId: user.id,
			});

			return newQuestion;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async updateStatus(status: QuestionStatus, id: number) {
		return await Question.update({status}, {where: {id}});
	}

	//get all user questions
	async getAll(
		userId: number,
		limit: number | undefined,
		offset: number | undefined,
		order: string,
	) {
		return await Question.findAll({
			where: {userId},
			limit,
			offset,
			order: [['created_at', order]],
		});
	}

	async sumUserOpenBountyAmount(userId: number) {
		return await Question.findAll({
			where: {userId, status: QuestionStatus.Open},
			attributes: [
				[Sequelize.fn('sum', Sequelize.col('bounty_amount')), 'total_bounty'],
			],
			group: ['user_id'],
		});
	}

	async getQuestion(id: number) {
		return await Question.findOne({
			where: {id},
		});
	}

	async getUserOpenQuestion(id: number, userId: number) {
		return await Question.findOne({
			where: {
				id,
				userId,
				status: QuestionStatus.Open,
			},
		});
	}

	async getUserQuestions(userId: number): Promise<Question[]> {
		return await Question.findAll({where: {userId}});
	}

	async getOpenQuestionsOrderByBounty(
		limit?: number | undefined,
		offset?: number | undefined,
	) {
		return await Question.findAll({
			where: {status: QuestionStatus.Open},
			limit,
			offset,
			order: [
				['bounty_amount', 'DESC'],
				['created_at', 'ASC'],
			],
		});
	}

	async getUserQuestionsByStatus(userId: number, status: QuestionStatus) {
		return await Question.findAll({
			where: {userId, status},
		});
	}

	async getDoctorQuestion(id: number) {
		return await Question.findOne({
			where: {
				id,
			},
		});
	}

	async getDoctorAnswerdQuestionsByQuestionIds(
		limit: number | undefined,
		offset: number | undefined,
		questionIds: Array<number>,
	) {
		return await Question.findAll({
			where: {id: {[Op.in]: questionIds}},
			limit,
			offset,
			order: [['created_at', 'DESC']],
		});
	}
}

export default new QuestionService();
