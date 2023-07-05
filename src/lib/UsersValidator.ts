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
}

export default new UsersValidator();
