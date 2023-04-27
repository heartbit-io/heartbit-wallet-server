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

	//get all user questions
	async getAll(user_email: string, limit: number | undefined, offset: number | undefined, order: string ) {
		return await QuestionInstance.findAll({
			where: {user_email},
			limit,
			offset,
			order: [['createdAt', order]],
		});
	}


	async sumUserOpenBountyAmount(user_email: string) {
		return await QuestionInstance.findAll({
			where: {user_email, status: QuestionStatus.Open},
			attributes: [
				[Sequelize.fn('sum', Sequelize.col('bounty_amount')), 'total_bounty'],
			],
			group: ['user_email'],
		});
	}

	async getQuestion(id: number) {
		return await QuestionInstance.findOne({
			where: {id},
		});
	}

	async getUserOpenQuestion(id: number, user_email: string) {
		return await QuestionInstance.findOne({
			where: {
				id,
				user_email,
				status: QuestionStatus.Open,
			},
		});
	}

	async getUserQuestions(user_email: string): Promise<QuestionInstance[]> {
		return await QuestionInstance.findAll({where: {user_email}});
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
