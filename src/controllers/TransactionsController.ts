import {Request, Response} from 'express';

import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import TransactionService from '../services/TransactionService';
import {TxTypes} from '../util/enums';

class RepliesController {
	async getUserTransactions(req: Request, res: Response) {
		// fomatting for client
		const txTypeMap = {
			deposit: 'Deposit',
			withdraw: 'Withdraw',
			sign_up_bonus: 'Sign Up Bonus',
			bounty_earned: 'Bounty Earned',
			bounty_pledged: 'Bounty Pledged',
			bounty_refunded: 'Bounty Refunded',
		};

		try {
			const {pubkey} = req.params;

			const transactions = await TransactionService.getUserTransactions(
				pubkey.toLocaleLowerCase(),
			);
			if (!transactions || transactions.length === 0) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'User does not have any transaction',
							null,
						),
					);
			}
			const fomatedTransactions = transactions.map(transaction => {
				const txType: TxTypes = transaction.type;
				return {
					...transaction.dataValues,
					typeText: txTypeMap[txType],
				};
			});

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved user transactions',
						fomatedTransactions,
					),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new FormatResponse(
						false,
						HttpCodes.INTERNAL_SERVER_ERROR,
						error,
						null,
					),
				);
		}
	}
}

export default new RepliesController();
