import AirtableService from './AirtableService';
import ChatgptService from './ChatgptService';
import {CustomError} from '../util/CustomError';
import DeeplService from '../services/DeeplService';
import FcmService from '../services/FcmService';
import {HttpCodes} from '../util/HttpCodes';
import {QuestionAttributes} from '../domains/entities/Question';
import QuestionRepository from '../Repositories/QuestionRepository';
import {QuestionTypes} from '../util/enums';
import {RepliesAttributes, Reply} from '../domains/entities/Reply';
import ReplyRepository from '../Repositories/ReplyRepository';
import {ReplyResponseInterface} from '../controllers/RepliesController';
import {ReplyTypes} from '../util/enums';
import UserRepository from '../Repositories/UserRepository';
import {airTableDoctorDetails, mockTranslatedContent} from '../util/mockData';

class ReplyService {
	async createChatGPTReply(reply: RepliesAttributes) {
		try {
			const {questionId} = reply;

			const question = await QuestionRepository.getQuestion(Number(questionId));

			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question not found');

			const rawContentLanguage: any = question.rawContentLanguage;

			const replyForChatGpt = await ChatgptService.getChatGptReplyByQuestionId(
				Number(questionId),
			);

			if (replyForChatGpt)
				throw new CustomError(
					HttpCodes.ALREADY_EXIST,
					'Chatgpt reply already exist',
				);

			const questionAttr = question as QuestionAttributes;

			// TODO(david): If bountyAmount is not 0, use gpt-4 model(currently gpt-4 is waitlist)
			const model =
				question.bountyAmount === 0 ? 'gpt-3.5-turbo' : 'gpt-3.5-turbo';
			const maxTokens = 2048;
			let chatgptReply = await ChatgptService.create(
				questionAttr,
				model,
				maxTokens,
			);

			// If ChatGPT reply is not created, try again.
			if (!chatgptReply) {
				chatgptReply = await ChatgptService.create(
					questionAttr,
					model,
					maxTokens,
				);
			}

			if (!chatgptReply)
				throw new CustomError(HttpCodes.NOT_FOUND, 'ChatGPT not replied');

			const translateText =
				question.type === QuestionTypes.GENERAL
					? chatgptReply.jsonAnswer.aiAnswer
					: chatgptReply.jsonAnswer.guide;

			const translatedReply = await DeeplService.getTextTranslatedIntoEnglish(
				translateText,
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

			FcmService.sendNotification(
				question.userId,
				'HeartBit',
				"GPT-3.5's advice has arrived",
			);

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

			const rawContentLanguage: any = question.rawContentLanguage;

			const doctorReply = await ReplyRepository.getReplyByQuestionId(
				questionId,
			);

			if (doctorReply) {
				const user = await UserRepository.getUserDetailsById(
					doctorReply.userId,
				);

				if (!user || !user.airTableRecordId)
					throw new CustomError(HttpCodes.NOT_FOUND, 'Doctor was not found');

				const doctorDetails =
					process.env.NODE_ENV === 'test'
						? airTableDoctorDetails()
						: await AirtableService.getAirtableDoctorInfo(
								user.airTableRecordId,
						  );

				if (!doctorDetails)
					throw new CustomError(
						HttpCodes.NOT_FOUND,
						'Doctor detail was not found',
					);
				const doctorNote = doctorReply.translatedContent;
				if (!doctorNote) {
					await this._translateAndUpdateContent(
						doctorReply,
						rawContentLanguage,
					);
				}

				const title = doctorReply.translatedTitle;
				if (!title) {
					await this._translateAndUpdateTitle(doctorReply, rawContentLanguage);
				}

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
					doctorNote: doctorReply.translatedContent,
					title: doctorReply.translatedTitle,
				};
			}

			const chatGptReply = await ChatgptService.getChatGptReplyByQuestionId(
				Number(questionId),
			);

			if (!chatGptReply)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'Chatgpt reply was not found',
				);

			let translateText = chatGptReply.jsonAnswer.aiAnswer;
			if (question.type !== QuestionTypes.GENERAL) {
				translateText = chatGptReply.jsonAnswer.guide;
			}
			const translatedReply = await DeeplService.getTextTranslatedIntoEnglish(
				translateText,
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

	private async _translateAndUpdateTitle(
		doctorReply: Reply,
		rawContentLanguage: any,
	) {
		const translatedTitle =
			process.env.NODE_ENV === 'test'
				? mockTranslatedContent().translatedTitle
				: await DeeplService.getTextTranslatedIntoEnglish(
						doctorReply.title,
						rawContentLanguage,
				  );
		doctorReply.translatedTitle = translatedTitle.text;
		await ReplyRepository.updateReplyTranslatedTitleColumn(
			doctorReply.id,
			translatedTitle.text,
		);
	}

	private async _translateAndUpdateContent(
		doctorReply: Reply,
		rawContentLanguage: any,
	) {
		const translatedContent =
			process.env.NODE_ENV === 'test'
				? mockTranslatedContent().translatedDoctorNote
				: await DeeplService.getTextTranslatedIntoEnglish(
						doctorReply.content,
						rawContentLanguage,
				  );
		doctorReply.translatedContent = translatedContent.text;
		await ReplyRepository.updateReplyTranslatedContentColumn(
			doctorReply.id,
			translatedContent.text,
		);
	}

	async deleteReply(replyId: number, userId: number) {
		try {
			const reply = await ReplyRepository.getUserReply(replyId, userId);
			if (!reply) throw new CustomError(HttpCodes.NOT_FOUND, 'Reply not found');

			await ReplyRepository.deleteReply(reply.id);

			return true;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}
}

export default new ReplyService();
