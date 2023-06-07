import {Question, QuestionAttributes} from '../models/QuestionModel';

import {CustomError} from '../util/CustomError';
import DeeplService from './DeeplService';
import {HttpCodes} from '../util/HttpCodes';
import QuestionRepository from '../Repositories/QuestionRepository';
import {QuestionStatus} from '../util/enums';
import UserRepository from '../Repositories/UserRepository';

class QuestionService {
	async create(
		question: QuestionAttributes,
		email: string | undefined,
	): Promise<Question | CustomError> {
		try {
			if (!email)
				throw new CustomError(HttpCodes.BAD_REQUEST, 'Email is required');

			const user = await UserRepository.getUserDetailsByEmail(email);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			const userOpenBounty = await QuestionRepository.sumUserOpenBountyAmount(
				user.id,
			);

			const userOpenBountyTotal = userOpenBounty[0]
				? userOpenBounty[0].dataValues.totalBounty
				: 0;

			const totalBounty: number =
				Number(userOpenBountyTotal) + Number(question.bountyAmount);

			const userBtcBalance = user.get('btcBalance') as number;

			if (!userBtcBalance)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'Error getting user balance',
				);

			if (totalBounty > userBtcBalance) {
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'You do not have enough sats to post a new question',
				);
			}

			const enContent = await DeeplService.getTextTranslatedIntoEnglish(
				question.content,
			);

			const newQuestion = await QuestionRepository.create({
				...question,
				content: enContent.text,
				basicInfo: question.basicInfo || '',
				currentMedications: question.currentMedications || '',
				pastIllnessHistory: question.pastIllnessHistory || '',
				others: question.others || '',
				rawContentLanguage: enContent.detected_source_language, // snake case because deepl response
				rawContent: question.content,
				userId: user.id,
			});

			return newQuestion;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async deleteQuestion(
		questionId: number,
		email: string | undefined,
	): Promise<Boolean | CustomError> {
		try {
			const question = await QuestionRepository.getQuestion(questionId);
			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question was not found');

			if (!email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'Email is required');

			const user = await UserRepository.getUserDetailsByEmail(email);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			const userId: number = user.id;

			if (question.userId !== userId)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Only users who posted a question can delete the question',
				);

			await QuestionRepository.deleteQuestion(question);

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

	async getUserQuestionsByStatus(
		email: string | undefined,
		status: QuestionStatus,
	): Promise<Question[] | CustomError> {
		try {
			if (!email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'Email required');

			const user = await UserRepository.getUserDetailsByEmail(email);

			if (!user)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'Error getting user details',
				);

			const questions = await QuestionRepository.getUserQuestionsByStatus(
				user.id,
				status,
			);

			return questions;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	//get all user questions
	async getAll(
		email: string | undefined,
		limit: number | undefined,
		offset: number | undefined,
		order: string,
	) {
		try {
			if (!email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'Email is required');

			const user = await UserRepository.getUserDetailsByEmail(email);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			const userId: number = user.id;

			const questions = await QuestionRepository.getAll(
				userId,
				limit,
				offset,
				order,
			);
			return questions;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getQuestion(questionId: number, email: string | undefined) {
		try {
			const question = await QuestionRepository.getQuestion(questionId);
			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question not found');

			if (!email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'Email is required');

			const user = await UserRepository.getUserDetailsByEmail(email);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			if (question.userId !== user.id && !user.isDoctor)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Only users who posted a question can view the question',
				);

			const response = question.dataValues;
			response.content = response.rawContent;

			return response;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getOpenQuestionsOrderByBounty(
		limit?: number | undefined,
		offset?: number | undefined,
	): Promise<Question[] | CustomError> {
		try {
			return await QuestionRepository.getOpenQuestionsOrderByBounty(
				limit,
				offset,
			);
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

export default new QuestionService();
