import {Request, Response} from 'express';
import {ReplyInstance} from '../models/ReplyModel';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
import {QuestionInstance} from '../models/QuestionModel';
import {UserInstance} from '../models/UserModel';

class RepliesController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const question = await ReplyInstance.create({
				...req.body,
			});

			return res
				.status(HttpCodes.CREATED)
				.json(
					new FormatResponse(
						true,
						HttpCodes.CREATED,
						'Reply created successfully',
						question,
					),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new FormatResponse(
						false,
						HttpCodes.INTERNAL_SERVER_ERROR,
						error,
						null,
					),
				);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const {replyId} = req.params;

			const reply = await ReplyInstance.findOne({
				where: {id: replyId, user_pubkey: req.body.user_pubkey},
			});

			if (!reply) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Reply was not found',
							null,
						),
					);
			}

			await reply.destroy();

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Reply deleted successfully',
						null,
					),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new FormatResponse(
						false,
						HttpCodes.INTERNAL_SERVER_ERROR,
						error,
						null,
					),
				);
		}
	}

	async markAsBestReply(req: Request, res: Response) {
		try {
			const {replyId} = req.params;

			const reply = await ReplyInstance.findOne({
				where: {id: replyId},
			});

			if (!reply) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Check that the rely exist',
							null,
						),
					);
			}

			const question = await QuestionInstance.findOne({
				where: {id: reply.question_id},
			});

			if (!question) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'The question for this reply is not found',
							null,
						),
					);
			}
			if (question.user_pubkey !== req.body.user_pubkey) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Only the user that posted a question can mark a reply as best reply',
							null,
						),
					);
			}

			//check if question already has a best reply
			const existingBestReply = await ReplyInstance.findOne({
				where: {question_id: reply.question_id, best_reply: true},
			});

			if (existingBestReply) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'A question can only have a single best reply',
							null,
						),
					);
			}

			const updateReply = await reply.update({
				best_reply: true,
			});

			//create a transaction
			const user = await UserInstance.findOne({
				where: {pubkey: question.user_pubkey},
			});
			const responder = await UserInstance.findOne({
				where: {pubkey: reply.user_pubkey},
			});

			if (!user || !responder) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'User account or responder account not found',
							null,
						),
					);
			}

			//debit user bounty amount
			const user_balance = user.btc_balance - question.bounty_amount;
			const user_debit = await UserInstance.update({ btc_balance: user_balance }, {
				where: {
					pubkey: user.pubkey
				}
			});

			if (!user_debit) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'error debit user account',
							null,
						),
					);
			}

			const responder_balance = responder.btc_balance + question.bounty_amount;
			const responder_credit = await UserInstance.update({ btc_balance: responder_balance }, {
				where: {
					pubkey: responder.pubkey
				}
			});

			if (!responder_credit) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'error crediting responder account',
							null,
						),
					);
			}

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully mark reply as best reply',
						updateReply,
					),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new FormatResponse(
						false,
						HttpCodes.INTERNAL_SERVER_ERROR,
						error,
						null,
					),
				);
		}
	}
}

export default new RepliesController();
