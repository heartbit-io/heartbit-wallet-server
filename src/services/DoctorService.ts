import {QuestionStatus, QuestionTypes, TxTypes} from '../util/enums';
import ChatgptService from './ChatgptService';
import {CustomError} from '../util/CustomError';
import EventEmitter from 'events';
import FcmService from '../services/FcmService';
import {HttpCodes} from '../util/HttpCodes';
import {JsonAnswerInterface} from '../domains/entities/ChatGptReply';
import {Question} from '../domains/entities/Question';
import QuestionRepository from '../Repositories/QuestionRepository';
import {RepliesAttributes} from '../domains/entities/Reply';
import ReplyRepository from '../Repositories/ReplyRepository';
import TransactionsRepository from '../Repositories/BtcTransactionsRepository';
import {User} from '../domains/entities/User';
import UserRepository from '../Repositories/UserRepository';
import {UserRoles} from '../util/enums/userRoles';
import admin from '../config/firebase-config';
import ChatGptRepository from '../Repositories/ChatGptRepository';
import DoctorQuestionRepository from '../Repositories/DoctorQuestionRepository';
import dataSource from '../domains/repo';

const eventEmitter = new EventEmitter();

class DoctorService {
	async createDoctorReply(
		requestBody: RepliesAttributes,
		email: string | undefined,
	) {
		try {
			if (!email)
				throw new CustomError(HttpCodes.UNAUTHORIZED, 'User not logged in');

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

			const user = await UserRepository.getUserDetailsById(question.userId);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			if (user.id === doctor.id)
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'User and doctor cannot be the same',
				);

			// If the bounty is 0, no bounty is calculated.
			if (question.bountyAmount && question.bountyAmount > 0) {
				// 100 is default sats
				// const calulatedFee =
				// 	100 + Math.floor((question.bountyAmount - 100) * 0.02);

				const creditDoctor = await this._updateDoctorBalance(doctor, question);

				if (!creditDoctor)
					throw new CustomError(
						HttpCodes.UNPROCESSED_CONTENT,
						'error crediting doctor account',
					);

				await TransactionsRepository.createTransaction({
					amount: question.bountyAmount,
					toUserPubkey: doctor.pubkey,
					fromUserPubkey: user.pubkey,
					fee: 0,
					type: TxTypes.BOUNTY_EARNED,
				});
			}

			const reply = await this._updateQuestion(requestBody, doctor, question);

			if (process.env.NODE_ENV !== 'test') {
				await FcmService.sendNotification(
					question.userId,
					'HeartBit',
					"A human doctor's answer has arrived",
					{type: 'DOCTOR_ANSWER'},
				);
			}

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

	private async _updateQuestion(
		requestBody: RepliesAttributes,
		doctor: User,
		question: Question,
	) {
		const reply = await ReplyRepository.createReply({
			...requestBody,
			userId: doctor.id,
		});

		await QuestionRepository.updateStatus(
			QuestionStatus.CLOSED,
			Number(question.id),
		);

		//[TODO:Peter] move to an event bus
		await DoctorQuestionRepository.deleteDoctorQuestion(
			Number(doctor.id),
			Number(question.id),
		);
		return reply;
	}

	private async _updateDoctorBalance(doctor: User, question: Question) {
		const doctorBalance =
			Number(doctor.btcBalance) + Number(question.bountyAmount);
		const creditDoctor = await UserRepository.updateUserBtcBalance(
			doctorBalance,
			doctor.id,
		);
		return creditDoctor;
	}

	async getOpenQuestionForDoctor(email: string | undefined) {
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
			const openQuestion =
				await QuestionRepository.getOpenQuestionsOrderByBounty();

			if (!openQuestion) return;

			const aiReply = await ChatGptRepository.getChatgptReply(
				Number(openQuestion.id),
			);

			if (!aiReply)
				throw new CustomError(HttpCodes.NOT_FOUND, 'AI Reply not found');

			const aiJsonReply: JsonAnswerInterface = aiReply.jsonAnswer;

			return {
				...openQuestion,
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
			const aiReply = await ChatgptService.getChatGptReplyByQuestionId(
				Number(questionId),
			);

			if (!aiReply)
				throw new CustomError(HttpCodes.NOT_FOUND, 'AI reply not found');

			const aiJsonReply = aiReply.jsonAnswer;

			if (question.type === QuestionTypes.GENERAL) {
				aiJsonReply.doctorNote = aiJsonReply.doctorAnswer;
			}

			return {...question, aiJsonReply};
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
	) {
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

			return {...question, ...doctorReply};
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

	async assignQuestionToDoctor(
		doctorId: number,
		questionId: number,
		email: string | undefined,
	) {
		const querryRunner = dataSource.createQueryRunner();
		await querryRunner.connect();
		await querryRunner.startTransaction('REPEATABLE READ');
		try {
			const question = await QuestionRepository.getQuestion(questionId);
			if (!question || question.status !== QuestionStatus.OPEN)
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'Question not found or is no longer open',
				);

			const doctor = await UserRepository.getUserDetailsById(doctorId);

			if (!doctor || doctor.role !== UserRoles.DOCTOR)
				throw new CustomError(HttpCodes.NOT_FOUND, 'Doctor not found');

			if (!email || email !== doctor.email)
				throw new CustomError(
					HttpCodes.UNAUTHORIZED,
					'You dont have permission to access this resource',
				);

			const doctorQuestionStatus =
				await DoctorQuestionRepository.getDoctorQuestionStatus(
					doctorId,
					questionId,
				);

			if (doctorQuestionStatus)
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'Doctor is already assigned to question',
				);

			const doctorQuestion =
				await DoctorQuestionRepository.createDoctorQuestion({
					doctorId,
					questionId,
				});
			if (!doctorQuestion)
				throw new CustomError(
					HttpCodes.INTERNAL_SERVER_ERROR,
					'Error assigning question to doctor',
				);
			const updatedQuestion = await QuestionRepository.updateStatus(
				QuestionStatus.ASSIGNED,
				questionId,
			);

			if (!updatedQuestion)
				throw new CustomError(
					HttpCodes.INTERNAL_SERVER_ERROR,
					'Error updating question',
				);
			querryRunner.commitTransaction();
			return doctorQuestion;
		} catch (error: any) {
			await querryRunner.rollbackTransaction();
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		} finally {
			await querryRunner.release();
		}
	}
}

export default new DoctorService();
