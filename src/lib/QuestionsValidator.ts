import {body, param, query} from 'express-validator';

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
				),
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
	getAllQuestions() {
		return [
			query('limit')
				.optional()
				.isNumeric()
				.withMessage('limit must be a number'),
			query('offset')
				.optional()
				.isNumeric()
				.withMessage('offset must be a number'),
			query('order')
				.optional()
				.isString()
				.toUpperCase()
				.isIn(['ASC', 'DESC'])
				.withMessage('order must be ASC or DESC')
				.trim()
				.escape(),
		];
	}
}

export default new QuestionsValidator();
