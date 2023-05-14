import ChatgptService from '../services/ChatgptService';
import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import {Response} from 'express';
import TransactionService from '../services/TransactionService';
import {TxTypes} from '../util/enums/txTypes';
import {UserRoles} from '../util/enums/userRoles';
import UserService from '../services/UserService';
import admin from '../config/firebase-config';
import EventEmitter from "events";



const eventEmitter = new EventEmitter();
// after doctor auth, remove this
const TEMP_DOCTOR_EMAIL = 'nodirbek7077@gmail.com';

class DoctorsController {
	async createDoctorReply(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			// check that the user is logged in
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

			const email = req.email;

			// check that it is a doctor
			const doctor = await UserService.getUserDetailsByEmail(email);

			// TODO[Peter]: Extract this into a middleware to check if the user is a doctor

			if (!doctor || !doctor.isDoctor) {
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'Only doctors can reply to a question',
							null,
						),
					);
			}

			const question = await QuestionService.getQuestion(req.body.questionId);

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

			// create a transaction
			const user = await UserService.getUserDetailsById(question.userId);

			if (!user) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'User account  not found',
							null,
						),
					);
			}

			if (user.id === doctor.id) {
				return res
					.status(HttpCodes.BAD_REQUEST)
					.json(
						new FormatResponse(
							false,
							HttpCodes.BAD_REQUEST,
							'User and doctor cannot be the same',
							null,
						),
					);
			}

			// XXX, TODO(david) start a database transaction
			// debit user bounty amount
			const userBalance = user.btcBalance - question.bountyAmount;
			const userDebit = UserService.updateUserBtcBalance(userBalance, user.id);

			if (!userDebit) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'error debit user account',
							null,
						),
					);
			}

			// 100 is default sats
			const calulatedFee =
				100 + Math.floor((question.bountyAmount - 100) * 0.02);

			const doctorBalance =
				doctor.btcBalance + question.bountyAmount - calulatedFee;
			const creditDoctor = await UserService.updateUserBtcBalance(
				doctorBalance,
				doctor.id,
			);

			if (!creditDoctor) {
				return res
					.status(HttpCodes.UNPROCESSED_CONTENT)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNPROCESSED_CONTENT,
							'error crediting doctor account',
							null,
						),
					);
			}

			//create a transaction
			await TransactionService.createTransaction({
				amount: question.bountyAmount - calulatedFee,
				toUserPubkey: doctor.pubkey,
				fromUserPubkey: user.pubkey,
				fee: calulatedFee,
				type: TxTypes.BOUNTY_EARNED,
			});

			const reply = await ReplyService.createReply({
				...req.body,
				userId: user.id,
				userEmail: email,
			});

			// XXX, TODO(david): end a database transaction

			return res
				.status(HttpCodes.CREATED)
				.json(
					new FormatResponse(
						true,
						HttpCodes.CREATED,
						'Reply created successfully',
						reply,
					),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new FormatResponse(
						false,
						HttpCodes.INTERNAL_SERVER_ERROR,
						error,
						null,
					),
				);
		}
	}
	async getQuestions(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		const limit = (req.query.limit as number | undefined) || 1;
		const offset = req.query.offset as number | undefined;
		req.email = TEMP_DOCTOR_EMAIL;
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

		req.email = TEMP_DOCTOR_EMAIL;
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
		req.email = TEMP_DOCTOR_EMAIL;
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
		const questionIds = replies.map(reply => reply.questionId);
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

		req.email = TEMP_DOCTOR_EMAIL;
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
		}

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
}

export default new DoctorsController();
