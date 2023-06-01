import ChatgptService from '../services/ChatgptService';
import EventEmitter from 'events';
import {HttpCodes} from '../util/HttpCodes';
import {Question, QuestionStatus} from '../models/QuestionModel';
import {TxTypes} from '../util/enums/txTypes';
import {UserRoles} from '../util/enums/userRoles';
import admin from '../config/firebase-config';
import {CustomError} from '../util/CustomError';
import UserRepository from '../Repositories/UserRepository';
import QuestionRepository from '../Repositories/QuestionRepository';
import ReplyRepository from '../Repositories/ReplyRepository';
import {RepliesAttributes} from '../models/ReplyModel';
import ChatGPTRepository from '../Repositories/ChatGPTRepository';
import TransactionsRepository from '../Repositories/TransactionsRepository';

const eventEmitter = new EventEmitter();

class DoctorService {
	async createDoctorReply(
		requestBody: RepliesAttributes,
		email: string | undefined,
	) {
		try {
			// check that the user is logged in
			if (!email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'User not logged in');

			// check that it is a doctor
			const doctor = await UserRepository.getUserDetailsByEmail(email);

			if (!doctor || !doctor.isDoctor) {
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Only doctors can reply to a question',
				);
			}

			const question = await QuestionRepository.getQuestion(
				requestBody.questionId,
			);

			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question was not found');

			// create a transaction
			const user = await UserRepository.getUserDetailsById(question.userId);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			if (user.id === doctor.id)
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'User and doctor cannot be the same',
				);

			// If the bounty is 0, no bounty is calculated.
			if (question.bountyAmount) {
				// XXX, TODO(david) start a database transaction
				// debit user bounty amount
				const userBalance = user.btcBalance - question.bountyAmount;
				const userDebit = UserRepository.updateUserBtcBalance(
					userBalance,
					user.id,
				);

				if (!userDebit)
					throw new CustomError(
						HttpCodes.UNPROCESSED_CONTENT,
						'error debiting user account',
					);
				// 100 is default sats
				const calulatedFee =
					100 + Math.floor((question.bountyAmount - 100) * 0.02);

				const doctorBalance =
					doctor.btcBalance + question.bountyAmount - calulatedFee;
				const creditDoctor = await UserRepository.updateUserBtcBalance(
					doctorBalance,
					doctor.id,
				);

				if (!creditDoctor)
					throw new CustomError(
						HttpCodes.UNPROCESSED_CONTENT,
						'error crediting doctor account',
					);

				// create a transaction
				await TransactionsRepository.createTransaction({
					amount: question.bountyAmount - calulatedFee,
					toUserPubkey: doctor.pubkey,
					fromUserPubkey: user.pubkey,
					fee: calulatedFee,
					type: TxTypes.BOUNTY_EARNED,
				});
			}

			const reply = await ReplyRepository.createReply({
				...requestBody,
				userId: doctor.id,
			});

			// question status update
			await QuestionRepository.updateStatus(
				QuestionStatus.Closed,
				Number(question.id),
			);

			// XXX, TODO(david): end a database transaction

			return reply;
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getQuestions(
		email: string | undefined,
		limit: number,
		offset: number | undefined,
	) {
		try {
			if (!email)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Error getting user email',
				);

			const doctor = await UserRepository.getUserDetailsByEmail(email);

			if (!doctor || doctor.role !== UserRoles.DOCTOR)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'User must be a doctor to get user questions',
				);

			const openQuestions =
				await QuestionRepository.getOpenQuestionsOrderByBounty(limit, offset);

			// TODO(david): join the question and reply table
			const aiReply = await ChatgptService.getChatGptReplyByQuestionId(
				Number(openQuestions[0].id),
			);

			if (!aiReply)
				throw new CustomError(HttpCodes.NOT_FOUND, 'AI Reply not found');

			const aiJsonReply = aiReply.jsonAnswer;

			return {
				...openQuestions[0].dataValues,
				title: aiJsonReply.title,
				chiefComplaint: aiJsonReply.chiefComplaint,
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

	async getQuestion(questionId: number, email: string | undefined) {
		try {
			if (!email)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Error getting user email',
				);
			// check that it is a doctor
			const doctor = await UserRepository.getUserDetailsByEmail(email);

			if (!doctor || doctor.role !== UserRoles.DOCTOR)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'User must be a doctor to get user questions',
				);

			const question = await QuestionRepository.getDoctorQuestion(
				Number(questionId),
			);

			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question not found');

			// TODO(david): join the question and reply table
			const aiReply = await ChatGPTRepository.getChatGptReplyByQuestionId(
				Number(questionId),
			);

			if (!aiReply)
				throw new CustomError(HttpCodes.NOT_FOUND, 'AI reply not found');

			const aiJsonReply = aiReply.jsonAnswer;

			return {...question.dataValues, ...aiJsonReply};
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getDoctorAnsweredQuestions(
		email: string | undefined,
		limit: number,
		offset: number | undefined,
	): Promise<Question[] | CustomError> {
		try {
			if (!email)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'Error getting user email',
				);

			// check that it is a doctor
			const doctor = await UserRepository.getUserDetailsByEmail(email);

			if (!doctor || doctor.role !== UserRoles.DOCTOR)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'User must be a doctor to get user questions',
				);

			// TODO(david): Join the question and reply table
			const replies = await ReplyRepository.getDoctorReplies(Number(doctor.id));
			const questionIds = replies.map(
				(reply: {questionId: any}) => reply.questionId,
			);
			const questions =
				await QuestionRepository.getDoctorAnswerdQuestionsByQuestionIds(
					limit,
					offset,
					questionIds,
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

	async getDoctorAnsweredQuestion(
		email: string | undefined,
		questionId: number,
	) {
		try {
			if (!email)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'error getting user email',
				);

			// check that it is a doctor
			const doctor = await UserRepository.getUserDetailsByEmail(email);

			if (!doctor || doctor.role !== UserRoles.DOCTOR)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'User must be a doctor');

			// check that the question is answered by the doctor
			const doctorReply = await ReplyRepository.getDoctorReply(
				Number(questionId),
				Number(doctor.id),
			);

			if (!doctorReply)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Doctor reply not found');

			const question = await QuestionRepository.getDoctorQuestion(
				Number(questionId),
			);

			if (!question)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Question not found');

			return {...question.dataValues, ...doctorReply.dataValues};
		} catch (error: any) {
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async login(token: string | undefined) {
		try {
			if (!token)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'User not logged in');

			const decoded = await admin.auth().verifyIdToken(token);

			if (!decoded || !decoded.email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'Invalid token');

			const user = await UserRepository.getUserDetailsByEmail(decoded.email);

			if (!user)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'User not found');

			if (user.role !== UserRoles.DOCTOR)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'You dont have permission to access this resource',
				);

			const data = {
				email: user.email,
				role: user.role,
				token,
			};

			eventEmitter.emit('event:doctor_verified', data);

			return data;
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

export default new DoctorService();
