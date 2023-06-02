import {Request, Response} from 'express';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import TransactionService from '../services/TransactionService';

class TransactionsController {
	async getUserTransactions(req: Request, res: Response) {
		try {
			const {pubkey} = req.params;
			const transactions = await TransactionService.getUserTransactions(
				pubkey.toLocaleLowerCase(),
			);
			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved user transactions',
						transactions,
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

export default new TransactionsController();
