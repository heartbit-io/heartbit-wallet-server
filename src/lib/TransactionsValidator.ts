import {param} from 'express-validator';
import UserService from '../services/UserService';

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
					const user = await UserService.getUserDetails(value);
					if (!user) {
						throw new Error('User with given public key does not exits');
					}
				}),
		];
	}
}

export default new TransactionsValidator();
