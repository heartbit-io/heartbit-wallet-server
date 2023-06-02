import {Op, Sequelize} from 'sequelize';
import {
	Question,
	QuestionAttributes,
	QuestionStatus,
} from '../models/QuestionModel';

class QuestionService {
	async create(question: QuestionAttributes) {
		return await Question.create({...question});
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
