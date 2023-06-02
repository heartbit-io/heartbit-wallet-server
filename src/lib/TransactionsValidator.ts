import UserRepository from '../Repositories/UserRepository';
import {param} from 'express-validator';

class TransactionsValidator {
	user() {
		return [
			param('pubkey')
				.notEmpty()
				// .isAlphanumeric() // XXX(david): comment to develop
				.trim()
				.escape()
				.withMessage('User public key is required to get their transactions')
				.custom(async value => {
					const user = await UserRepository.getUserDetailsByPubkey(
						value.toLowerCase(),
					);
					if (!user) {
						throw new Error('User with given public key does not exits');
					}
				}),
		];
	}
}

export default new TransactionsValidator();
