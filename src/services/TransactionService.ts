import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import TransactionsRepository from '../Repositories/BtcTransactionsRepository';

class TransactionService {
	txTypeMap = {
		deposit: 'Deposit',
		withdraw: 'Withdraw',
		sign_up_bonus: 'Sign-up bonus',
		bounty_earned: 'Bounty earned',
		bounty_pledged: 'Bounty pledged',
		bounty_refunded: 'Bounty refunded',
	};

	async getUserTransactions(userPubkey: string, limit: number, offset: number) {
		try {
			const transactions = await TransactionsRepository.getUserTransactions(
				userPubkey,
				limit,
				offset,
			);

			if (!transactions || transactions.length === 0)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'User does not have any transaction',
				);
			const count = await TransactionsRepository.getUserTransactionsCount(
				userPubkey,
			);
			const hasMore = offset + limit < count ? true : false;

			return {transactions, hasMore};
		} catch (error: any) {
			throw new CustomError(HttpCodes.INTERNAL_SERVER_ERROR, error);
		}
	}
}

export default new TransactionService();
