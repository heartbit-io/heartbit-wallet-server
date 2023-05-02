import {
	QuestionAttributes,
	QuestionInstance,
	QuestionStatus,
} from '../models/QuestionModel';

import {Sequelize} from 'sequelize';

class QuestionService {
	async create(question: QuestionAttributes) {
		return await QuestionInstance.create({...question});
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

	async getOpenQuestionsOrderByBounty() {
		return await QuestionInstance.findAll({
			where: {status: QuestionStatus.Open},
			order: [
				['bountyAmount', 'DESC'],
				['createdAt', 'ASC'],
			],
		});
	}
}

export default new QuestionService();
