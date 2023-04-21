import {body, param} from 'express-validator';

import UserService from '../services/UserService';

class QuestionsValidator {
	checkCreateQuestion() {
		return [
			body('user_email')
				.notEmpty()
				.isAlphanumeric()
				.trim()
				.escape()
				.withMessage('User public key is required to post a question')
				.custom(async value => {
					const user = await UserService.getUserDetails(value);

					if (!user) {
						throw new Error('User with given public key does not exit');
					}
				}),
			body('content')
				.isString()
				.notEmpty()
				.rtrim()
				.escape()
				.isLength({min: 50})
				.withMessage('sufficiently describe your health issue'),
			body('bounty_amount')
				.isNumeric()
				.notEmpty()
				.withMessage(
					'indicate the amount of bounty you want to place for this question',
				)
				.custom(async (value, {req}) => {
					const user_balance = await UserService.getUserBalance(
						req.body.user_email,
					);
					if (!user_balance) {
						throw new Error('User does not exist');
					}
					if (value >= user_balance.btc_balance) {
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
