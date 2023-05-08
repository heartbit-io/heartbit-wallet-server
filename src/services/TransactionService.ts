import {
	TransactionAttributes,
	TransactionInstance,
} from '../models/TransactionModel';

import {Op} from 'sequelize';

class TransactionService {
	async createTransaction(
		transaction: TransactionAttributes,
		dbTransaction?: any,
	): Promise<TransactionInstance> {
		return await TransactionInstance.create(
			{
				amount: transaction.amount,
				fromUserPubkey: transaction.fromUserPubkey,
				toUserPubkey: transaction.toUserPubkey,
				fee: transaction.fee,
				type: transaction.type,
			},
			{transaction: dbTransaction},
		);
	}

	async getUserTransactions(
		userPubkey: string,
	): Promise<TransactionInstance[]> {
		return await TransactionInstance.findAll({
			where: {
				[Op.or]: [{fromUserPubkey: userPubkey}, {toUserPubkey: userPubkey}],
			},
		});
	}
}

export default new TransactionService();
