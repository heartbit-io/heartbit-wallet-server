import {BtcTransactionDataSource} from '../domains/repo';
import {BtcTransactionFields} from '../domains/entities/BtcTransaction';

class BtcTransactionRepository {
	async createTransaction(
		transaction: BtcTransactionFields,
		dbTransaction?: any,
	) {
		return await BtcTransactionDataSource.save(
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

	async getUserTransactions(userPubkey: string, limit: number, offset: number) {
		return await BtcTransactionDataSource.find({
			where: [{fromUserPubkey: userPubkey}, {toUserPubkey: userPubkey}],
			take: limit,
			skip: offset,
		});
	}

	async getUserTransactionsCount(userPubkey: string): Promise<number> {
		return await BtcTransactionDataSource.count({
			where: [{fromUserPubkey: userPubkey}, {toUserPubkey: userPubkey}],
		});
	}
}

export default new BtcTransactionRepository();
