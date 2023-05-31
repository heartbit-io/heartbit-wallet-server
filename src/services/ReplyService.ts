import ChatGPTRepository from '../Repositories/ChatGPTRepository';
import QuestionRepository from '../Repositories/QuestionRepository';
import {RepliesAttributes, Reply} from '../models/ReplyModel';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import DeeplService from '../services/DeeplService';
import {ReplyResponseInterface} from '../controllers/RepliesController';
import {ReplyTypes} from '../util/enums';
import ReplyRepository from '../Repositories/ReplyRepository';
import UserRepository from '../Repositories/UserRepository';
import AirtableService from './AirtableService';

class ReplyService {
	async createChatGPTReply(reply: RepliesAttributes) {
		try {
			const {questionId} = reply;

			const question = await QuestionRepository.getQuestion(Number(questionId));

			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question not found');

			const rawContentLanguage: any = question.dataValues.rawContentLanguage;

			const {content} = question;

			const replyForChatGpt =
				await ChatGPTRepository.getChatGptReplyByQuestionId(Number(questionId));

			if (replyForChatGpt)
				throw new CustomError(
					HttpCodes.AREADY_EXIST,
					'Chatgpt reply already exist',
				);

			// TODO(david): If bountyAmount is not 0, use gpt-4 model(currently gpt-4 is waitlist)
			const model =
				question.bountyAmount === 0 ? 'gpt-3.5-turbo' : 'gpt-3.5-turbo';
			const maxTokens = 2048;
			const chatgptReply = await ChatGPTRepository.create(
				Number(questionId),
				content,
				model,
				maxTokens,
			);

			if (!chatgptReply)
				throw new CustomError(HttpCodes.NOT_FOUND, 'ChatGPT not replied');

			const translatedReply = await DeeplService.getTextTranslatedIntoEnglish(
				chatgptReply.jsonAnswer.triageGuide,
				rawContentLanguage,
			);

			// set response
			const replyResponseInterface: ReplyResponseInterface = {
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Chatgpt reply successfully',
				data: {
					replyType: ReplyTypes.AI,
					name: 'Advice by GPT-3.5', // TODO(david): formatting
					classification: 'Open AI',
					reply: translatedReply.text,
					createdAt: chatgptReply.createdAt, // TODO(david): date formatting, 1 Apr 2023
				},
			};

			return replyResponseInterface;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getReplyByQuestionId(questionId: number) {
		try {
			const question = await QuestionRepository.getQuestion(questionId);
			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question not found');

			const rawContentLanguage: any = question.dataValues.rawContentLanguage;

			const doctorReply = await ReplyRepository.getReplyByQuestionId(
				questionId,
			);

			if (doctorReply) {
				const user = await UserRepository.getUserDetailsById(
					doctorReply.userId,
				);

				if (!user || !user.airTableRecordId)
					throw new CustomError(HttpCodes.NOT_FOUND, 'Doctor was not found');

				const doctorDetails = await AirtableService.getAirtableDoctorInfo(
					user.airTableRecordId,
				);

				if (!doctorDetails)
					throw new CustomError(
						HttpCodes.NOT_FOUND,
						'Doctor detail was not found',
					);
				const replyType = ReplyTypes.DOCTOR;
				const name =
					doctorDetails.fields['First Name'] +
					' ' +
					doctorDetails.fields['Last Name'];
				const classification = 'General physician'; // TODO(david): Get from user like user.classification

				return {
					...doctorReply,
					replyType,
					name,
					classification,
					reply: doctorReply.content,
				};
			}

			const chatGptReply = await ChatGPTRepository.getChatGptReplyByQuestionId(
				Number(questionId),
			);

			if (!chatGptReply)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'Chatgpt reply was not found',
				);

			const translatedReply = await DeeplService.getTextTranslatedIntoEnglish(
				chatGptReply.jsonAnswer.triageGuide,
				rawContentLanguage,
			);

			const replyType = ReplyTypes.AI;
			const name = 'Advice by GPT-3.5'; // TODO(david): formatting
			const reply = translatedReply.text;
			const classification = 'Open AI';
			const createdAt = chatGptReply.createdAt;

			return {
				replyType,
				name,
				classification,
				reply,
				createdAt,
			};
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async createReply(reply: RepliesAttributes) {
		return await Reply.create({
			...reply,
		});
	}

	async getReplyById(id: number) {
		return await Reply.findOne({
			where: {id},
		});
	}

	async getUserReplies(userId: number) {
		return await Reply.findAll({where: {userId}});
	}

	async getQuestionReplies(questionId: number) {
		return await Reply.findAll({where: {questionId}});
	}

	async getUserReply(id: number, userId: number) {
		return await Reply.findOne({
			where: {id, userId},
		});
	}

	async getDoctorReplies(userId: number) {
		return await Reply.findAll({
			where: {userId},
		});
	}

	async getDoctorReply(questionId: number, userId: number) {
		return await Reply.findOne({
			where: {questionId, userId},
		});
	}

	async deleteReply(reply: Reply) {
		return await reply.destroy();
	}
}

export default new ReplyService();
