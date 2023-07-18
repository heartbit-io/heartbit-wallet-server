import {body, param, query} from 'express-validator';
import QuestionRepository from '../Repositories/QuestionRepository';

class DoctorsValidator {
	getQuestion() {
		return [
			query('index')
				.isString()
				.notEmpty()
				.rtrim()
				.escape()
				.withMessage('supply index as query string'),
		];
	}
}

export default new DoctorsValidator();
