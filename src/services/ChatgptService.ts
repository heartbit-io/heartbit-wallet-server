import {Configuration, OpenAIApi} from 'openai';
import {makeAnswerToJson, makePrompt} from '../util/chatgpt';
import {ChatgptReplyInstance} from '../models/ChatgptReplyModel';
import logger from '../util/logger';
import env from '../config/env';

export interface AnswerInterface {
	role: string;
	content: string;
}

export interface JsonAnswerInterface {
	[title: string]: string;
	triageGuide: string;
	chiefComplaint: string;
	medicalHistory: string;
	currentMedication: string;
	accessment: string;
	plan: string;
	doctorNote: string;
}
class ChatgptService {
	private openai: OpenAIApi;

	constructor(apiKey: string) {
		this.openai = new OpenAIApi(new Configuration({apiKey}));
	}

	/**
	 * @description - Create ChatGPT Completion for prompt
	 * @param questionId - Question ID
	 * @param questionContent - Question content
	 * @param model - AI model
	 * @param maxTokens - Max tokens upper: 2048, For English text, 1 token is approximately 4 characters or 0.75 words
	 * @returns
	 */
	async create(
		questionId: number,
		questionContent: string,
		model: string,
		maxTokens: number,
	): Promise<ChatgptReplyInstance | undefined> {
		try {
			// TODO(david): Add patient profile parameter
			const prompt = makePrompt(questionContent, '');

			const completion = await this.openai.createChatCompletion({
				model,
				messages: [{role: 'user', content: prompt}],
				max_tokens: maxTokens,
			});

			const rawAnswer = completion.data.choices[0].message?.content || '';
			const jsonAnswer: JsonAnswerInterface = makeAnswerToJson(rawAnswer);

			return await ChatgptReplyInstance.create({
				question_id: questionId,
				model,
				maxTokens,
				prompt,
				rawAnswer,
				jsonAnswer: JSON.parse(JSON.stringify(jsonAnswer)),
			});
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}
}

export default new ChatgptService(env.OPEN_AI_API_KEY);
