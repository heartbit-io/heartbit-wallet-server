import ChatGptRepository from '../Repositories/ChatGptRepository';
import QuestionRepository from '../Repositories/QuestionRepository';
import * as Sentry from '@sentry/node';
import DeeplService from '../services/DeeplService';
import {QuestionAttributes} from '../domains/entities/Question';
import ChatGptEvent from '../events/ChatGptEvent';
import ChatgptService from '../services/ChatgptService';

const ChatGptReplyListener = new ChatGptEvent();

const onChatGptReplyEvent = async (questionId: number) => {
	const model = 'gpt-3.5-turbo';
	const maxTokens = 2048;
	try {
		const question = await QuestionRepository.getQuestion(questionId);

		if (!question) {
			Sentry.captureMessage(`error getting question for chatgpt response`);
			return;
		}
		const rawContentLanguage: any = question.rawContentLanguage;
		const questionAttr = question as QuestionAttributes;

		const chatgptReply = await ChatgptService.create(
			questionAttr,
			model,
			maxTokens,
		);

		if (!chatgptReply) {
			Sentry.captureMessage(`error creating chatgpt response`);
			return;
		}

		const translateText = chatgptReply.rawAnswer;

		if (
			question.rawContentLanguage &&
			question.rawContentLanguage.toUpperCase() !== 'EN'
		) {
			const translatedReply = await DeeplService.getTextTranslatedIntoEnglish(
				translateText,
				rawContentLanguage,
			);

			await ChatGptRepository.updateTranslatedChatGptReply(
				chatgptReply.id,
				translatedReply.text,
			);
		}
	} catch (error) {
		Sentry.captureMessage(
			`error creating chatgpt response in events: ${error}`,
		);
	}
};

ChatGptReplyListener.on('questionIdForChatGptReply', onChatGptReplyEvent);

export default ChatGptReplyListener;
