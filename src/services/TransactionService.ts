import {
	TransactionAttributes,
	TransactionInstance,
} from '../models/TransactionModel';

import {Op} from 'sequelize';

class TransactionService {
	async createTransaction(
		transaction: TransactionAttributes,
	): Promise<TransactionInstance> {
		return await TransactionInstance.create({
			amount: transaction.amount,
			from_user_pubkey: transaction.from_user_pubkey,
			to_user_pubkey: transaction.to_user_pubkey,
		});
	}

	async getUserTransactions(
		user_pubkey: string,
	): Promise<TransactionInstance[]> {
		return await TransactionInstance.findAll({
			where: {
				[Op.or]: [
					{from_user_pubkey: user_pubkey},
					{to_user_pubkey: user_pubkey},
				],
			},
		});
	}
}

export default new TransactionService();
