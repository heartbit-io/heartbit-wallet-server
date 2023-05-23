import {Op, Sequelize} from 'sequelize';
import {
	QuestionAttributes,
	QuestionInstance,
	QuestionStatus,
} from '../models/QuestionModel';

class QuestionService {
	async create(question: QuestionAttributes) {
		return await QuestionInstance.create({...question});
	}

	async updateStatus(status: QuestionStatus, id: number) {
		return await QuestionInstance.update({status}, {where: {id}});
	}

	//get all user questions
	async getAll(
		userId: number,
		limit: number | undefined,
		offset: number | undefined,
		order: string,
	) {
		return await QuestionInstance.findAll({
			where: {userId},
			limit,
			offset,
			order: [['createdAt', order]],
		});
	}

	async sumUserOpenBountyAmount(userId: number) {
		return await QuestionInstance.findAll({
			where: {userId, status: QuestionStatus.Open},
			attributes: [
				[Sequelize.fn('sum', Sequelize.col('bountyAmount')), 'totalBounty'],
			],
			group: ['userId'],
		});
	}

	async getQuestion(id: number) {
		return await QuestionInstance.findOne({
			where: {id},
		});
	}

	async getUserOpenQuestion(id: number, userId: number) {
		return await QuestionInstance.findOne({
			where: {
				id,
				userId,
				status: QuestionStatus.Open,
			},
		});
	}

	async getUserQuestions(userId: number): Promise<QuestionInstance[]> {
		return await QuestionInstance.findAll({where: {userId}});
	}

	async getOpenQuestionsOrderByBounty(
		limit?: number | undefined,
		offset?: number | undefined,
	) {
		return await QuestionInstance.findAll({
			where: {status: QuestionStatus.Open},
			limit,
			offset,
			order: [
				['bountyAmount', 'DESC'],
				['createdAt', 'ASC'],
			],
		});
	}

	async getUserQuestionsByStatus(userId: number, status: QuestionStatus) {
		return await QuestionInstance.findAll({
			where: {userId, status},
		});
	}

	async getDoctorQuestion(id: number) {
		return await QuestionInstance.findOne({
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
		return await QuestionInstance.findAll({
			where: {id: {[Op.in]: questionIds}},
			limit,
			offset,
			order: [['createdAt', 'DESC']],
		});
	}
}

export default new QuestionService();
