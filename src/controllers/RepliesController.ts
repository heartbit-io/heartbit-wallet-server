import {Request, Response} from 'express';

import ChatgptService from '../services/ChatgptService';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import {ReplyTypes} from '../util/enums/replyTypes';
import UserService from '../services/UserService';
import { DecodedRequest } from '../middleware/Auth';
import { UserRoles } from '../util/enums';

class RepliesController {
	async createChatGPTReply(
		req: Request,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;

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

	async createDoctorReply(req: DecodedRequest, res: Response): Promise<Response<FormatResponse>> {
		try {
			// check that the user is logged in
			if (!req.email) { 
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'Error getting user email',
							null,
						),
					);
			}

			const email = req.email;
			//check that it is a doctor
			const user = await UserService.getUserDetailsByEmail(email);

			//TODO[Peter]: Extract this into a middleware to check if the user is a doctor

			if (!user || user.role !== UserRoles.DOCTOR) { 
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'User must be a doctor to reply to a question',
							null,
						),
					);
			}
			// check that the question has not already been answered by a doctor
			const question = await ReplyService.createReply({...req.body, user_email: email});

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
