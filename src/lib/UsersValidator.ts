import UserRepository from '../Repositories/UserRepository';
import {body} from 'express-validator';

class UsersValidator {
	userCreate() {
		return [
			body('pubkey')
				.notEmpty()
				.trim()
				.escape()
				.withMessage('Supply a valid public key'),
			body('email')
				.notEmpty()
				.isEmail()
				.trim()
				.escape()
				.withMessage('Supply a valid email address'),
			body('role')
				.isString()
				.notEmpty()
				.isIn(['user', 'doctor', 'admin'])
				.withMessage('indicate the user type'),
			body('btcBalance').isNumeric().withMessage('btcBalance is a number'),
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
					const user = await UserRepository.getUserDetailsById(value);
					if (!user) {
						throw new Error('User with given email does not exit');
					}
				}),
		];
	}
}

export default new UsersValidator();
