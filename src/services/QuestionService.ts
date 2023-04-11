import { Sequelize } from 'sequelize';
import { QuestionStatus, QuestionInstance } from '../models/QuestionModel';

export interface QuestionInterface {
	content: string;
	user_pubkey: string;
	bounty_amount: number;
}
class QuestionService {
	async create(question: QuestionInterface) {
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
}

export default new QuestionService();
