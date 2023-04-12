import {body, param} from 'express-validator';
import {UserInstance} from '../models/UserModel';

class QuestionsValidator {
	checkCreateQuestion() {
		return [
			body('user_pubkey')
				.notEmpty()
				.isAlphanumeric()
				.trim()
				.escape()
				.withMessage('User public key is required to post a question')
				.custom(async value => {
					const user = await UserInstance.findOne({where: {pubkey: value}});

					if (!user) {
						throw new Error('User does not have an account');
					}
				}),
			body('content')
				.isString()
				.notEmpty()
				.rtrim()
				.escape()
				.isLength({min: 50})
				.withMessage(
					'sufficient description of your health question is required',
				),
			body('bounty_amount')
				.isNumeric()
				.notEmpty()
				.withMessage(
					'indicate the amount of bounty you want to place for this question',
				)
				.custom(async (value, { req }) => {
					const user_btc_balance = await UserInstance.findOne({
						where: {pubkey: req.body.user_pubkey},
					});
					if (!user_btc_balance) {
						throw new Error('User does not exist');
					}
					if (value >= user_btc_balance.btc_balance) {
						throw new Error(
							'You do not have sufficient balance for this bounty amount',
						);
					}
				}),
		];
	}
	checkQuestion() {
		return [
			param('questionId')
				.notEmpty()
				.isNumeric()
				.withMessage('supply question Id to delete'),
		];
	}
}

export default new QuestionsValidator();
