import {BtcTransactionDataSource} from '../domains/repo';
import {BtcTransactionFields} from '../domains/entities/BtcTransaction';
import {TxTypes} from '../util/enums';

class BtcTransactionRepository {
	async createTransaction(transaction: BtcTransactionFields) {
		return await BtcTransactionDataSource.save({
			amount: transaction.amount,
			fromUserPubkey: transaction.fromUserPubkey,
			toUserPubkey: transaction.toUserPubkey,
			fee: transaction.fee,
			type: transaction.type,
		});
	}

	private getTransactionBaseQuery(userPubkey: string) {
		return BtcTransactionDataSource.createQueryBuilder('btds')
			.where(
				'(btds.fromUserPubkey = :userPubkey OR btds.toUserPubkey = :userPubkey)',
				{userPubkey},
			)
			.andWhere('btds.amount != 0')
			.orWhere('(btds.type = :type AND btds.toUserPubkey = :userPubkey)', {
				type: TxTypes.BOUNTY_EARNED,
				userPubkey,
			});
	}

	async getUserTransactions(userPubkey: string, limit: number, offset: number) {
		return this.getTransactionBaseQuery(userPubkey)
			.limit(limit)
			.offset(offset)
			.orderBy('btds.createdAt', 'DESC')
			.getMany();
	}

	async getUserTransactionsCount(userPubkey: string): Promise<number> {
		return this.getTransactionBaseQuery(userPubkey).getCount();
	}
}

export default new BtcTransactionRepository();
