import {Request, Response} from 'express';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
import ReplyService from '../services/ReplyService';
import QuestionService from '../services/QuestionService';
import UserService from '../services/UserService';
import TransactionService from '../services/TransactionService';

class RepliesController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const question = await ReplyService.createReply({...req.body});

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

			const reply = await ReplyService.getUserReply(
				Number(replyId),
				req.body.user_pubkey,
			);
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

			await ReplyService.deleteReply(reply);

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
			const reply = await ReplyService.getReplyById(Number(replyId));

			if (!reply) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Check that the reply exist',
							null,
						),
					);
			}
			const question = await QuestionService.getQuestion(reply.question_id);
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
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Only the user that posted a question can mark a reply as best reply',
							null,
						),
					);
			}

			//check if question already has a best reply
			const existingBestReply = await ReplyService.getQuestionBestReply(
				reply.question_id,
			);
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

			//create a transaction
			const user = await UserService.getUserDetails(question.user_pubkey);
			const responder = await UserService.getUserDetails(reply.user_pubkey);

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

			const user_debit = UserService.updateUserBtcBalance(
				user_balance,
				user.pubkey,
			);

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
			const responder_credit = await UserService.updateUserBtcBalance(
				responder_balance,
				responder.pubkey,
			);

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

			//create a transaction
			await TransactionService.createTransaction({
				amount: question.bounty_amount,
				to_user_pubkey: responder.pubkey,
				from_user_pubkey: user.pubkey,
			});

			const updateReply = await ReplyService.updateReply(reply);

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
