import {Request, Response} from 'express';

import ChatgptService from '../services/ChatgptService';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import {ReplyTypes} from '../util/enums/replyTypes';
import UserService from '../services/UserService';

export interface ReplyResponseInterface extends FormatResponse {
	data: {
		replyType: ReplyTypes;
		name: string;
		classification: string;
		reply: string;
		createdAt: Date;
	};
}

class RepliesController {
	async createChatGPTReply(
		req: Request,
		res: Response,
	): Promise<Response<ReplyResponseInterface>> {
		try {
			const {questionId} = req.body;

			const question = await QuestionService.getQuestion(Number(questionId));

			if (!question) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'Question was not exist',
							null,
						),
					);
			}

			const {content} = question;

			const replyForChatGpt = await ChatgptService.getChatGptReplyByQuestionId(
				Number(questionId),
			);

			if (replyForChatGpt) {
				return res
					.status(HttpCodes.AREADY_EXIST)
					.json(
						new FormatResponse(
							false,
							HttpCodes.AREADY_EXIST,
							'Chatgpt reply already exist',
							null,
						),
					);
			}

			// TODO(david): If bountyAmount is not 0, use gpt-4 model(currently gpt-4 is waitlist)
			const model =
				question.bountyAmount === 0 ? 'gpt-3.5-turbo' : 'gpt-3.5-turbo';
			const maxTokens = 2048;
			const chatgptReply = await ChatgptService.create(
				Number(questionId),
				content,
				model,
				maxTokens,
			);

			if (!chatgptReply) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'ChatGPT not replied',
							null,
						),
					);
			}

			// set response
			const replyResponseInterface: ReplyResponseInterface = {
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Chatgpt reply successfully',
				data: {
					replyType: ReplyTypes.AI,
					name: model,
					classification: 'Open AI',
					reply: chatgptReply.jsonAnswer.triageGuide || '',
					createdAt: chatgptReply.createdAt, // TODO(david): date formatting, 1 Apr 2023
				},
			};

			return res.status(HttpCodes.CREATED).json(replyResponseInterface);
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

	async get(
		req: Request,
		res: Response,
	): Promise<Response<ReplyResponseInterface>> {
		try {
			const {questionId} = req.params;
			let replyType: ReplyTypes;
			let reply: string;
			let name: string;
			let classification: string;
			let createdAt: Date;
			const replyForDoctor = await ReplyService.getReplyByQuestionId(
				Number(questionId),
			);

			if (replyForDoctor) {
				const user = await UserService.getUserDetailsById(
					replyForDoctor.userId,
				);
				if (!user) {
					return res
						.status(HttpCodes.UNPROCESSED_CONTENT)
						.json(
							new FormatResponse(
								false,
								HttpCodes.UNPROCESSED_CONTENT,
								'Doctor was not found',
								null,
							),
						);
				}

				replyType = ReplyTypes.DOCTOR;
				name = user.email; // TODO(david): name?, user model has not name
				reply = replyForDoctor.content; // TODO(david): Add Health records using JSON format
				classification = 'General physician'; // TODO(david): Get from user like user.classification
				createdAt = replyForDoctor.createdAt;
			} else {
				const replyForChatGpt =
					await ChatgptService.getChatGptReplyByQuestionId(Number(questionId));

				if (!replyForChatGpt) {
					return res
						.status(HttpCodes.UNPROCESSED_CONTENT)
						.json(
							new FormatResponse(
								false,
								HttpCodes.UNPROCESSED_CONTENT,
								'Chatgpt reply was not found',
								null,
							),
						);
				}
				replyType = ReplyTypes.AI;
				name = replyForChatGpt.model;
				reply = replyForChatGpt.jsonAnswer.triageGuide;
				classification = 'Open AI';
				createdAt = replyForChatGpt.createdAt;
			}

			// set response
			const replyResponseInterface: ReplyResponseInterface = {
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Reply retrieved successfully',
				data: {replyType, name, classification, reply, createdAt},
			};

			return res.status(HttpCodes.OK).json(replyResponseInterface);
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
