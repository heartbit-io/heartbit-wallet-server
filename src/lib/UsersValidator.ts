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
	userLogin() {
		return [
			body('password')
				.notEmpty()
				.isAlphanumeric()
				.trim()
				.escape()
				.withMessage('User password is required to login'),
			body('email')
				.isEmail()
				.notEmpty()
				.trim()
				.escape()
				.withMessage('User email is required to login')
				.custom(async value => {
					const user = await UserService.getUserDetails(value);
					if (!user) {
						throw new Error('User with given email does not exit');
					}
				}),
		];
	}
}

export default new UsersValidator();
