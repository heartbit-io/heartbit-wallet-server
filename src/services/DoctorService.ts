import {Request, Response} from 'express';

import ChatgptService from '../services/ChatgptService';
import {DecodedRequest} from '../middleware/Auth';
import EventEmitter from 'events';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import {QuestionStatus} from '../models/QuestionModel';
import ReplyService from '../services/ReplyService';
import TransactionService from '../services/TransactionService';
import {TxTypes} from '../util/enums/txTypes';
import {UserRoles} from '../util/enums/userRoles';
import UserService from '../services/UserService';
import admin from '../config/firebase-config';
import path from 'path';
import {CustomError} from '../util/CustomError';
import UserRepository from '../Repositories/UserRepository';
import QuestionRepository from '../Repositories/QuestionRepository';
import ReplyRepository from '../Repositories/ReplyRepository';
import {RepliesAttributes} from '../models/ReplyModel';

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
			const user = await UserService.getUserDetailsById(question.userId);

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
				const userDebit = UserService.updateUserBtcBalance(
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
				const creditDoctor = await UserService.updateUserBtcBalance(
					doctorBalance,
					doctor.id,
				);

				if (!creditDoctor)
					throw new CustomError(
						HttpCodes.UNPROCESSED_CONTENT,
						'error crediting doctor account',
					);

				// create a transaction
				await TransactionService.createTransaction({
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
			await QuestionService.updateStatus(
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
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		const limit = (req.query.limit as number | undefined) || 1;
		const offset = req.query.offset as number | undefined;

		if (!req.email) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'Error getting user email',
						null,
					),
				);
		}

		//check that it is a doctor
		const doctor = await UserService.getUserDetailsByEmail(req.email);

		if (!doctor || doctor.role !== UserRoles.DOCTOR) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'User must be a doctor to get user questions',
						null,
					),
				);
		}

		const openQuestions = await QuestionService.getOpenQuestionsOrderByBounty(
			limit,
			offset,
		);

		// TODO(david): join the question and reply table
		const aiReply = await ChatgptService.getChatGptReplyByQuestionId(
			Number(openQuestions[0].id),
		);

		if (!aiReply) {
			return res
				.status(HttpCodes.NOT_FOUND)
				.json(
					new FormatResponse(
						false,
						HttpCodes.NOT_FOUND,
						'AI reply was not found',
						null,
					),
				);
		}

		const aiJsonReply = aiReply.jsonAnswer;

		return res.status(HttpCodes.OK).json(
			new FormatResponse(
				true,
				HttpCodes.OK,
				'Questions retrieved successfully',
				{
					...openQuestions[0].dataValues,
					title: aiJsonReply.title,
					chiefComplaint: aiJsonReply.chiefComplaint,
				},
			),
		);
	}

	async getQuestion(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		const {questionId} = req.params;

		if (!req.email) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'Error getting user email',
						null,
					),
				);
		}

		// check that it is a doctor
		const doctor = await UserService.getUserDetailsByEmail(req.email);

		if (!doctor || doctor.role !== UserRoles.DOCTOR) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'User must be a doctor to get user questions',
						null,
					),
				);
		}

		const question = await QuestionService.getDoctorQuestion(
			Number(questionId),
		);

		if (!question) {
			return res
				.status(HttpCodes.NOT_FOUND)
				.json(
					new FormatResponse(
						false,
						HttpCodes.NOT_FOUND,
						'Question was not found',
						null,
					),
				);
		}

		// TODO(david): join the question and reply table
		const aiReply = await ChatgptService.getChatGptReplyByQuestionId(
			Number(questionId),
		);

		if (!aiReply) {
			return res
				.status(HttpCodes.NOT_FOUND)
				.json(
					new FormatResponse(
						false,
						HttpCodes.NOT_FOUND,
						'AI reply was not found',
						null,
					),
				);
		}

		const aiJsonReply = aiReply.jsonAnswer;

		return res.status(HttpCodes.OK).json(
			new FormatResponse(
				true,
				HttpCodes.OK,
				'Question retrieved successfully',
				{
					bountyAmount: question.bountyAmount,
					createdAt: question.createdAt,
					updatedAt: question.updatedAt,
					content: question.content,
					userId: question.userId,
					title: aiJsonReply.title,
					chiefComplaint: aiJsonReply.chiefComplaint,
					medicalHistory: aiJsonReply.medicalHistory,
					currentMedications: aiJsonReply.currentMedication,
					assessment: aiJsonReply.assessment,
					plan: aiJsonReply.plan,
					triage: aiJsonReply.triageGuide,
					doctorNote: aiJsonReply.doctorNote,
				},
			),
		);
	}

	async getDoctorAnsweredQuestions(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		const limit = (req.query.limit as number | undefined) || 1;
		const offset = req.query.offset as number | undefined;

		if (!req.email) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'Error getting user email',
						null,
					),
				);
		}

		// check that it is a doctor
		const doctor = await UserService.getUserDetailsByEmail(req.email);

		if (!doctor || doctor.role !== UserRoles.DOCTOR) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'User must be a doctor to get user questions',
						null,
					),
				);
		}

		// TODO(david): Join the question and reply table
		const replies = await ReplyService.getDoctorReplies(Number(doctor.id));
		const questionIds = replies.map(
			(reply: {questionId: any}) => reply.questionId,
		);
		const questions =
			await QuestionService.getDoctorAnswerdQuestionsByQuestionIds(
				limit,
				offset,
				questionIds,
			);

		return res
			.status(HttpCodes.OK)
			.json(
				new FormatResponse(
					true,
					HttpCodes.OK,
					'Replies retrieved successfully',
					questions,
				),
			);
	}

	async getDoctorAnsweredQuestion(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		const {questionId} = req.params;

		if (!req.email) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'Error getting user email',
						null,
					),
				);
		}

		// check that it is a doctor
		const doctor = await UserService.getUserDetailsByEmail(req.email);

		if (!doctor || doctor.role !== UserRoles.DOCTOR) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'User must be a doctor to get user questions',
						null,
					),
				);
		}

		// check that the question is answered by the doctor
		const doctorReply = await ReplyService.getDoctorReply(
			Number(questionId),
			Number(doctor.id),
		);

		if (!doctorReply) {
			return res
				.status(HttpCodes.NOT_FOUND)
				.json(
					new FormatResponse(
						false,
						HttpCodes.NOT_FOUND,
						'Doctor reply was not found',
						null,
					),
				);
		}

		const question = await QuestionService.getDoctorQuestion(
			Number(questionId),
		);

		if (!question) {
			return res
				.status(HttpCodes.NOT_FOUND)
				.json(
					new FormatResponse(
						false,
						HttpCodes.NOT_FOUND,
						'Question was not found',
						null,
					),
				);
		}

		return res.status(HttpCodes.OK).json(
			new FormatResponse(true, HttpCodes.OK, 'Replies retrieved successfully', {
				bountyAmount: question.bountyAmount,
				createdAt: question.createdAt,
				updatedAt: question.updatedAt,
				content: question.content,
				userId: question.userId,
				title: doctorReply.title || '',
				chiefComplaint: doctorReply.majorComplaint,
				medicalHistory: doctorReply.medicalHistory,
				currentMedications: doctorReply.currentMedications,
				assessment: doctorReply.assessment,
				plan: doctorReply.plan,
				triage: doctorReply.triage,
				doctorNote: doctorReply.content,
			}),
		);
	}

	async login(req: DecodedRequest, res: Response) {
		const token = req.headers.authorization?.split(' ')[1] || '';

		if (!token) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'No token provided',
						null,
					),
				);
		}

		const decoded = await admin.auth().verifyIdToken(token);

		if (!decoded || !decoded.email) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'Invalid token',
						null,
					),
				);
		}

		const user = await UserService.getUserDetailsByEmail(decoded.email);

		if (!user) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'User not found',
						null,
					),
				);
		}

		if (user.role !== UserRoles.DOCTOR) {
			return res
				.status(HttpCodes.UNAUTHORIZED)
				.json(
					new FormatResponse(
						false,
						HttpCodes.UNAUTHORIZED,
						'User is not a doctor',
						null,
					),
				);
		}

		const data = {
			email: user.email,
			role: user.role,
			token,
		};

		eventEmitter.emit('event:doctor_verified', data);

		return res
			.status(HttpCodes.OK)
			.json(
				new FormatResponse(
					true,
					HttpCodes.OK,
					'User logged in successfully',
					data,
				),
			);
	}

	portal(req: Request, res: Response) {
		return res.sendFile(path.join(__dirname, '../public/qrcode.html'));
	}
}

export default new DoctorService();
