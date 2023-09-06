import * as Sentry from '@sentry/node';
import {makePrompt} from '../util/chatgpt';
import {ChatGptReply} from '../domains/entities/ChatGptReply';
import {QuestionAttributes} from '../domains/entities/Question';
import {QuestionTypes} from '../util/enums';
import env from '../config/env';
import ChatGptRepository from '../Repositories/ChatGptRepository';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import OpenAI from 'openai';
import decodeContent from '../lib/DecodeText';

export interface AnswerInterface {
	role: string;
	content: string;
}

export interface JsonAnswerInterface {
	[title: string]: string;
	aiAnswer: string;
	doctorAnswer: string;
	guide: string;
	chiefComplaint: string;
	presentIllness: string;
	pastMedicalHistory: string;
	currentMedication: string;
	assessment: string;
	plan: string;
	doctorNote: string;
}

class ChatgptService {
	private openai: OpenAI;

	constructor(apiKey: string) {
		// this.openai = new OpenAIApi(new Configuration({apiKey}));
		this.openai = new OpenAI({
			apiKey,
		});
	}

	/**
	 * @description - Create ChatGPT Completion for prompt
	 * @param question - Question
	 * @param model - AI model
	 * @param maxTokens - Max tokens upper: 2048, For English text, 1 token is approximately 4 characters or 0.75 words
	 * @returns
	 */
	async create(
		question: QuestionAttributes,
		model: string,
		maxTokens: number,
	): Promise<ChatGptReply | undefined> {
		const questionContent = decodeContent(question.content);
		question.content = questionContent;
		const prompt = makePrompt(question);
		const questionId = Number(question.id);

		try {
			// TODO(david): Add patient profile parameter

			const completion = await this.openai.chat.completions.create({
				model,
				messages: [{role: 'user', content: prompt}],
				max_tokens: maxTokens,
			});
			const rawAnswer = completion.choices[0].message?.content || '';
			// const jsonAnswer: JsonAnswerInterface = JSON.parse(`${rawAnswer}`);
			// if (!jsonAnswer.title) {
			// 	jsonAnswer.title = new Date().toISOString();
			// }

			return await ChatGptRepository.createChaptGptReply({
				questionId,
				model,
				maxTokens,
				prompt,
				rawAnswer,
			});
		} catch (error: any) {
			if (error instanceof OpenAI.APIError) {
				Sentry.captureMessage(`ChatGPT error: ${error}`);
				throw error.status && error.message
					? error
					: new CustomError(HttpCodes.INTERNAL_SERVER_ERROR, `${error}`);
			} else {
				new CustomError(HttpCodes.INTERNAL_SERVER_ERROR, error);
			}
		}
	}

	/**
	 * @description - Get ChatGPT Completion for prompt
	 * @param questionId - Question ID
	 */
	async getChatGptReplyByQuestionId(questionId: number) {
		try {
			const chatGptReply = await ChatGptRepository.getChatGptReply(questionId);
			return chatGptReply;
		} catch (error: any) {
			Sentry.captureMessage(`Error getting chatgpt response: ${error}`);
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}
}

export default new ChatgptService(env.OPEN_AI_API_KEY);
