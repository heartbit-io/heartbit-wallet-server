import {body} from 'express-validator';
import UserService from '../services/UserService';

class UsersValidator {
	userCreate() {
		return [
			body('pubkey')
                .notEmpty()
                .isAlphanumeric()
				.trim()
				.escape()
				.withMessage('User public key is required to post a question')
				.custom(async value => {
					const user = await UserService.getUserDetails(value);
					if (user) {
						throw new Error('User with given public key exits');
					}
				}),
			body('role')
				.isString()
				.notEmpty()
				.isIn(['user', 'doctor', 'admin'])
				.withMessage('indicate the user type'),
			body('btc_balance').isNumeric().withMessage('btc_balance is a number'),
		];
	}
}

export default new UsersValidator();
