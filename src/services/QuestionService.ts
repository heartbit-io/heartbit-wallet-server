import {Sequelize} from 'sequelize';
import {
	QuestionStatus,
	QuestionInstance,
	QuestionAttributes,
} from '../models/QuestionModel';

class QuestionService {
	async create(question: QuestionAttributes) {
		return await QuestionInstance.create({...question});
	}

	async getAll(limit: number | undefined, offset: number | undefined) {
		return await QuestionInstance.findAll({
			where: {},
			limit,
			offset,
		});
	}

	async sumUserOpenBountyAmount(user_pubkey: string) {
		return await QuestionInstance.findAll({
			where: {user_pubkey, status: QuestionStatus.Open},
			attributes: [
				[Sequelize.fn('sum', Sequelize.col('bounty_amount')), 'total_bounty'],
			],
			group: ['user_pubkey'],
		});
	}

	async getQuestion(id: number) {
		return await QuestionInstance.findOne({
			where: {id},
		});
	}

	async getUserOpenQuestion(id: number, user_pubkey: string) {
		return await QuestionInstance.findOne({
			where: {
				id,
				user_pubkey,
				status: QuestionStatus.Open,
			},
		});
	}

	async getUserQuestions(user_pubkey: string): Promise<QuestionInstance[]> {
		return await QuestionInstance.findAll({where: {user_pubkey}});
	}

	async getOpenQuestionsOrderByBounty() {
		return await QuestionInstance.findAll({
			where: {status: QuestionStatus.Open},
			order: [
				['bounty_amount', 'DESC'],
				['createdAt', 'ASC'],
			],
		});
	}
}

export default new QuestionService();
