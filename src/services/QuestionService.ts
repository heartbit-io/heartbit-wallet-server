import {QuestionAttributes} from '../domains/entities/Question';
import {CustomError} from '../util/CustomError';
import DeeplService from './DeeplService';
import {HttpCodes} from '../util/HttpCodes';
import QuestionRepository from '../Repositories/QuestionRepository';
import UserRepository from '../Repositories/UserRepository';
import TransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {QuestionStatus, TxTypes} from '../util/enums';
class QuestionService {
	async create(question: QuestionAttributes, email: string | undefined) {
		const {
			content,
			bountyAmount,
			currentMedication,
			ageSexEthnicity,
			pastIllnessHistory,
			others,
		} = question;
		// todo[tvpeter]: add transaction
		// const dbTransaction = await dbconnection.transaction();
		try {
			if (!email)
				throw new CustomError(HttpCodes.BAD_REQUEST, 'Email is required');
			const user = await UserRepository.getUserDetailsByEmail(email);
			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			const questionBounty = Number(bountyAmount);

			const userBtcBalance = user.btcBalance;

			if (!userBtcBalance)
				throw new CustomError(
					HttpCodes.NOT_FOUND,
					'Error getting user balance',
				);

			if (questionBounty > userBtcBalance) {
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'Insufficient balance to create question',
				);
			}

			const enContent = await DeeplService.getTextTranslatedIntoEnglish(
				content,
			);

			const newQuestion = await QuestionRepository.create({
				...question,
				content: enContent.text,
				currentMedication: currentMedication || '',
				ageSexEthnicity: ageSexEthnicity || '',
				pastIllnessHistory: pastIllnessHistory || '',
				others: others || '',
				rawContentLanguage: enContent.detected_source_language, // snake case because deepl response
				rawContent: content,
				userId: user.id,
			});

			if (!newQuestion)
				throw new CustomError(HttpCodes.BAD_REQUEST, 'Error creating question');
			const userNewBtcBalance = userBtcBalance - questionBounty;

			await UserRepository.updateUserBtcBalance(userNewBtcBalance, user.id);

			await TransactionsRepository.createTransaction({
				amount: questionBounty,
				fromUserPubkey: user.pubkey,
				toUserPubkey: user.pubkey,
				fee: 100,
				type: TxTypes.BOUNTY_PLEDGED,
			});
			newQuestion.content = content;

			return newQuestion;
		} catch (error: any) {
			// dbTransaction.rollback();
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

			await QuestionRepository.deleteQuestion(question.id);

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
	) {
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
		limit: number,
		offset: number,
		order: 'ASC' | 'DESC' = 'DESC',
	) {
		try {
			if (!email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'Email is required');

			const user = await UserRepository.getUserDetailsByEmail(email);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			const userId: number = user.id;

			const userQuestions = await QuestionRepository.countUserQuestions(userId);

			if (!userQuestions)
				throw new CustomError(HttpCodes.NOT_FOUND, 'User has no questions');

			const questions = await QuestionRepository.getAll(
				userId,
				limit,
				offset,
				order,
			);
			const hasMore = userQuestions > limit + offset ? true : false;
			const formatedQuestions = questions.map(question => {
				return {
					...question.dataValues,
					content: question.dataValues.rawContent,
				};
			});
			return {questions: formatedQuestions, hasMore};
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
	) {
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
