import {body} from 'express-validator';
import {UserInstance} from '../models/UserModel';

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
					const checkUser = await UserInstance.findOne({where: {pubkey: value}});
					if (checkUser) {
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
