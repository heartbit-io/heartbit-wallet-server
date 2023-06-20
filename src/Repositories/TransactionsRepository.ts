import {Transaction, TransactionAttributes} from '../models/TransactionModel';

import {Op} from 'sequelize';
import {TxTypes} from '../util/enums';

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
		return Transaction.findAll({
			where: {
				[Op.or]: [
					{
						[Op.and]: [
							{fromUserPubkey: userPubkey},
							{toUserPubkey: userPubkey},
						],
					},
					{
						[Op.and]: [
							{type: TxTypes.BOUNTY_EARNED}, // Bounty earnings should only be visible to the recipient.
							{toUserPubkey: userPubkey},
						],
					},
				],
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
