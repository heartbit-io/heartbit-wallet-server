import {Configuration, OpenAIApi} from 'openai';
import {makeAnswerToJson, makePrompt} from '../util/chatgpt';

import {ChatgptReply} from '../models/ChatgptReplyModel';
import {QuestionAttributes} from '../models/QuestionModel';
import {QuestionTypes} from '../util/enums';
import env from '../config/env';
import logger from '../util/logger';

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
	medicalHistory: string;
	currentMedication: string;
	assessment: string;
	plan: string;
	doctorNote: string;
}

class ChatGPTRepository {
	private openai: OpenAIApi;

	constructor(apiKey: string) {
		this.openai = new OpenAIApi(new Configuration({apiKey}));
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
	): Promise<ChatgptReply | undefined> {
		const prompt = makePrompt(question);
		const questionId = Number(question.id);

		try {
			const completion = await this.openai.createChatCompletion({
				model,
				messages: [{role: 'user', content: prompt}],
				max_tokens: maxTokens,
			});

			const rawAnswer = completion.data.choices[0].message?.content || '';
			const jsonAnswer: JsonAnswerInterface = makeAnswerToJson(rawAnswer);

			return await ChatgptReply.create({
				questionId,
				model,
				maxTokens,
				prompt,
				rawAnswer,
				jsonAnswer: {
					...jsonAnswer,
					triageGuide:
						question.type === QuestionTypes.GENERAL
							? jsonAnswer.aiAnswer
							: jsonAnswer.guide,
				},
			});
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}

	/**
	 * @description - Get ChatGPT Completion for prompt
	 * @param questionId - Question ID
	 */
	async getChatGptReplyByQuestionId(
		questionId: number,
	): Promise<ChatgptReply | undefined> {
		try {
			const chatGptReply = await ChatgptReply.findOne({
				where: {questionId},
				attributes: ['model', 'jsonAnswer', 'createdAt'],
			});

			if (!chatGptReply) return;

			return chatGptReply;
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}
}

export default new ChatGPTRepository(env.OPEN_AI_API_KEY);
