import {body, param, query} from 'express-validator';
import QuestionRepository from '../Repositories/QuestionRepository';

class QuestionsValidator {
	checkCreateQuestion() {
		return [
			body('content')
				.isString()
				.notEmpty()
				.rtrim()
				.escape()
				.isLength({min: 20})
				.withMessage('sufficiently describe your health issue'),
			body('bountyAmount')
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
				.withMessage('supply question Id'),
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
	getUserQuestionsBystatus() {
		return [
			query('status')
				.notEmpty()
				.isString()
				.isIn(['Open', 'Closed'])
				.withMessage('status must be OPEN or CLOSED')
				.trim()
				.escape(),
		];
	}

	deleteQuestion() {
		return [
			param('questionId')
				.notEmpty()
				.isNumeric()
				.withMessage('supply question Id to delete'),
		];
	}
	createChaptGptReply() {
		return [
			body('questionId')
				.notEmpty()
				.toInt()
				.withMessage('supply question Id to get chatgpt reply')
				.trim()
				.escape(),
		];
	}
}

export default new QuestionsValidator();
