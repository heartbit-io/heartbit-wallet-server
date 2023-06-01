import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import TransactionsRepository from '../Repositories/TransactionsRepository';

class TransactionService {
	txTypeMap = {
		deposit: 'Deposit',
		withdraw: 'Withdraw',
		sign_up_bonus: 'Sign-up bonus',
		bounty_earned: 'Bounty earned',
		bounty_pledged: 'Bounty pledged',
		bounty_refunded: 'Bounty refunded',
	};

	async getUserTransactions(userPubkey: string) {
		try {
			const transactions = await TransactionsRepository.getUserTransactions(
				userPubkey,
			);
			if (!transactions || transactions.length === 0)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'User does not have any transaction',
				);
			const fomatedTransactions = transactions.map(transaction => {
				return {
					...transaction.dataValues,
					type: this.txTypeMap[transaction.type],
				};
			});

			return fomatedTransactions;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}
}

export default new TransactionService();
