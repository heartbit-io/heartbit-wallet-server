import {param} from 'express-validator';
import {UserInstance} from '../models/UserModel';

class TransactionsValidator {
	user() {
		return [
			param('pubkey')
                .notEmpty()
                .isAlphanumeric()
				.trim()
				.escape()
				.withMessage('User public key is required to get their transactions')
				.custom(async value => {
					const checkUser = await UserInstance.findOne({where: {pubkey: value}});
					if (!checkUser) {
						throw new Error('User with given public key does not exits');
					}
				}),
		];
	}
}

export default new TransactionsValidator();
