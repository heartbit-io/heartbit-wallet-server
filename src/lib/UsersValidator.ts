import UserRepository from '../Repositories/UserRepository';
import {body, param} from 'express-validator';

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

	deleteUserAccount() {
		return [
			param('id').notEmpty().isNumeric().withMessage('Supply a valid user id'),
		];
	}
}

export default new UsersValidator();
