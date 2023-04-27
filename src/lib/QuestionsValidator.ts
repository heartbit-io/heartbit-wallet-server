import {body, param} from 'express-validator';

class QuestionsValidator {
	checkCreateQuestion() {
		return [
			body('content')
				.isString()
				.notEmpty()
				.rtrim()
				.escape()
				.isLength({min: 50})
				.withMessage('sufficiently describe your health issue'),
			body('bounty_amount')
				.isNumeric()
				.notEmpty()
				.withMessage(
					'indicate the amount of bounty you want to place for this question',
				)
		];
	}
	checkQuestion() {
		return [
			param('questionId')
				.notEmpty()
				.isNumeric()
				.withMessage('supply question Id to delete'),
		];
	}
}

export default new QuestionsValidator();
