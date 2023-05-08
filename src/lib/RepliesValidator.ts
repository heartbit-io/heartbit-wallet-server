import {body, param} from 'express-validator';

import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import UserService from '../services/UserService';

class RepliesValidator {
	checkCreateReply() {
		return [
			body('userId')
				.notEmpty()
				.isNumeric()
				.trim()
				.escape()
				.withMessage('User is required to respond to a question')
				.custom(async value => {
					const user = await UserService.getUserDetailsById(Number(value));

					if (!user) {
						throw new Error('User with given public key does not exit');
					}
				}),
			body('questionId')
				.isNumeric()
				.notEmpty()
				.withMessage('indicate the question you are responding to')
				.custom(async value => {
					const question = await QuestionService.getQuestion(Number(value));

					if (!question) {
						throw new Error('Question does not exist');
					}
				}),
			body([
				'content',
				'majorComplaint',
				'medicalHistory',
				'currentMedications',
				'assessment',
				'plan',
				'triage',
			])
				.isString()
				.notEmpty()
				.rtrim()
				.escape()
				.isLength({min: 50})
				.withMessage('sufficiently describe your answer to help the patient'),
		];
	}

	checkDeleteReply() {
		return [
			body('userId')
				.notEmpty()
				.isNumeric()
				.trim()
				.escape()
				.withMessage('User public key is required to delete a reply')
				.custom(async value => {
					const user = await UserService.getUserDetailsById(Number(value));

					if (!user) {
						throw new Error('User with given public key does not exit');
					}
				}),
			param('replyId')
				.isNumeric()
				.notEmpty()
				.withMessage('indicate the reply you want to delete')
				.custom(async value => {
					const reply = await ReplyService.getReplyById(Number(value));
					if (!reply) {
						throw new Error('Reply does not exist');
					}
				}),
		];
	}
}

export default new RepliesValidator();
