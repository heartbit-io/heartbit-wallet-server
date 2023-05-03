import {Request, Response} from 'express';

import ChatgptService from '../services/ChatgptService';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import {ReplyTypes} from '../util/enums/replyTypes';

class RepliesController {
	async createChatGPTReply(
		req: Request,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.body;

			const question = await QuestionService.getQuestion(Number(questionId));

			if (!question) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Question was not found',
							null,
						),
					);
			}

			const { content } = question;

			const model = 'gpt-3.5-turbo';
			const maxTokens = 2048;
			const chatgptReply = await ChatgptService.create(
				Number(questionId),
				content,
				model,
				maxTokens,
			);

			if (!chatgptReply) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'Chatgpt reply was not found',
							null,
						),
					);
			}

			const reply = chatgptReply.jsonAnswer.triageGuide;
			const createdAt = chatgptReply.createdAt;

			return res.status(HttpCodes.OK).json(
				new FormatResponse(true, HttpCodes.OK, 'Chatgpt reply successfully', {
					reply,
					createdAt,
				}),
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

	async get(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;
			let replyType: ReplyTypes;
			let reply: string;
			let name: string;
			let classification: string;
			let updatedAt: Date;
			const replyForDoctor = await ReplyService.getReplyByQuestionId(
				Number(questionId),
			);

			if (replyForDoctor) {
				replyType = ReplyTypes.DOCTOR;
				name = String(replyForDoctor.userId); // TODO(david) Get from user
				reply = replyForDoctor.content; // TODO(david) Add Health records using JSON format
				classification = 'General physician'; // TODO(david) Get from user
				updatedAt = replyForDoctor.updatedAt;
			} else {
				const replyForChatGpt =
					await ChatgptService.getChatGptReplyByQuestionId(Number(questionId));

				if (!replyForChatGpt) {
					return res
						.status(HttpCodes.NOT_FOUND)
						.json(
							new FormatResponse(
								false,
								HttpCodes.NOT_FOUND,
								'Chatgpt reply was not found',
								null,
							),
						);
				}
				replyType = ReplyTypes.AI;
				name = 'Trage by ' + replyForChatGpt.model;
				reply = replyForChatGpt.jsonAnswer.triageGuide;
				classification = 'Open AI';
				updatedAt = replyForChatGpt.updatedAt;
			}

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Reply retrieved successfully',
						{replyType, name, classification, reply, updatedAt},
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
				req.body.userId,
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

}

export default new RepliesController();
