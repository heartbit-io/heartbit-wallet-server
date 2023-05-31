import {Request, Response} from 'express';

import ChatgptService from '../services/ChatgptService';
import {DecodedRequest} from '../middleware/Auth';
import EventEmitter from 'events';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import {UserRoles} from '../util/enums/userRoles';
import UserService from '../services/UserService';
import admin from '../config/firebase-config';
import path from 'path';
import ResponseDto from '../dto/ResponseDTO';
import DoctorService from '../services/DoctorService';

const eventEmitter = new EventEmitter();

class DoctorsController {
	async createDoctorReply(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const reply = await DoctorService.createDoctorReply(req.body, req.email);

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
		} catch (error: any) {
			return res
				.status(error.code ? error.code : HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(
						false,
						error.code ? error.code : HttpCodes.INTERNAL_SERVER_ERROR,
						error.message ? error.message : 'HTTP error',
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

export default new DoctorsController();
