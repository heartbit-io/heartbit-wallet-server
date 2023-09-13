import {query} from 'express-validator';

class PaymentsValidator {
	validateEmaliAndAmount() {
		return [
			query('email')
				.isString()
				.trim() // trim should be in advance of notEmpty
				.notEmpty()
				.isEmail()
				.escape()
				.withMessage('provide a valid email'),
			query('amount')
				.isNumeric()
				.notEmpty()
				.escape()
				.withMessage(
					'indicate invoice amount in satoshis, e.g. 1000 for 0.00001000 BTC',
				),
		];
	}

	validateSecret() {
		return [
			query('q')
				.isString()
				.trim()
				.notEmpty()
				.escape()
				.withMessage('provide a valid q value'),
		];
	}

	validateSecretAndInvoice() {
		return [
			query('k1')
				.isString()
				.trim()
				.notEmpty()
				.escape()
				.withMessage('provide a valid k1 value'),
			query('pr')
				.isString()
				.trim()
				.notEmpty()
				.escape()
				.withMessage('provide a valid invoice'),
		];
	}
}

export default new PaymentsValidator();
