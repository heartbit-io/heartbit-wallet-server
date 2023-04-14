import {body, param} from 'express-validator';
import {UserInstance} from '../models/UserModel';
import { QuestionInstance } from '../models/QuestionModel';
import { ReplyInstance } from '../models/ReplyModel';

class RepliesValidator {
	checkCreateReply() {
		return [
			body('user_pubkey')
				.notEmpty()
				.isAlphanumeric()
				.trim()
				.escape()
				.withMessage('User is required to respond to a question')
				.custom(async value => {
					const user = await UserInstance.findOne({where: {pubkey: value}});

					if (!user) {
						throw new Error('User with given public key does not exit');
					}
                }),
                body('question_id')
				.isNumeric()
				.notEmpty()
				.withMessage(
					'indicate the question you are responding to',
				)
				.custom(async (value, { req }) => {
					const question = await QuestionInstance.findOne({
						where: {id: value},
					});
					if (!question) {
						throw new Error('Question does not exist');
					}
				}),
			body('content')
				.isString()
				.notEmpty()
				.rtrim()
				.escape()
				.isLength({min: 50})
				.withMessage(
					'sufficiently describe your answer to help the user',
				),
		];
	};

	checkDeleteReply() {
		return [
			body('user_pubkey')
				.notEmpty()
				.isAlphanumeric()
				.trim()
				.escape()
				.withMessage('User public key is required to delete a reply')
				.custom(async value => {
					const user = await UserInstance.findOne({where: {pubkey: value}});

					if (!user) {
						throw new Error('User with given public key does not exit');
					}
                }),
                param('question_id')
				.isNumeric()
				.notEmpty()
				.withMessage(
					'indicate the reply you want to delete',
				)
				.custom(async (value, { req }) => {
					const reply = await ReplyInstance.findOne({
						where: {id: value},
					});
					if (!reply) {
						throw new Error('Reply does not exist');
					}
				}),
		];
	}
    
}

export default new RepliesValidator();
