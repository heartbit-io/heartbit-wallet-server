import {Request, Response} from 'express';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
import { TransactionInstance } from '../models/TransactionModel';
import { Op } from 'sequelize';

class RepliesController {

	async getUserTransactions(req: Request, res: Response) {
		try {
			const {pubkey} = req.params;

			const transactions = await TransactionInstance.findAll({
				where: { [Op.or]: [ { from_user_pubkey: pubkey}, { to_user_pubkey: pubkey} ]},
			});

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

export default new RepliesController();
