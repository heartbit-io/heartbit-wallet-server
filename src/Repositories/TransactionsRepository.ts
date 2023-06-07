import {TransactionAttributes, Transaction} from '../models/TransactionModel';

import {Op} from 'sequelize';

class TransactionService {
	async createTransaction(
		transaction: TransactionAttributes,
		dbTransaction?: any,
	): Promise<Transaction> {
		return await Transaction.create(
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
		limit: number,
		offset: number,
	): Promise<Transaction[]> {
		return await Transaction.findAll({
			where: {
				[Op.or]: [{fromUserPubkey: userPubkey}, {toUserPubkey: userPubkey}],
			},
			limit,
			offset,
			raw: true,
		});
	}

	async getUserTransactionsCount(userPubkey: string): Promise<number> {
		return await Transaction.count({
			where: {
				[Op.or]: [{fromUserPubkey: userPubkey}, {toUserPubkey: userPubkey}],
			},
		});
	}
}

export default new TransactionService();
