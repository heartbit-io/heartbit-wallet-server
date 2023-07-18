import {Request, Response} from 'express';
import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import path from 'path';
import ResponseDto from '../dto/ResponseDTO';
import DoctorService from '../services/DoctorService';

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
					new ResponseDto(
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
		try {
			const index = Number(req.body.index) || 0;
			const response = await DoctorService.getOpenQuestionForDoctor(
				index,
				req.email,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Open question retrieved successfully',
						response,
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

	async getQuestion(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;

			const result = await DoctorService.getQuestion(
				Number(questionId),
				req.email,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Question retrieved successfully',
						result,
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

	async getDoctorAnsweredQuestions(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const limit = (req.query.limit as number | undefined) || 1;
			const offset = req.query.offset as number | undefined;

			const questions = await DoctorService.getDoctorAnsweredQuestions(
				req.email,
				limit,
				offset,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Replies retrieved successfully',
						questions,
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

	async getDoctorAnsweredQuestion(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {questionId} = req.params;

			const question = await DoctorService.getDoctorAnsweredQuestion(
				req.email,
				Number(questionId),
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Replies retrieved successfully',
						question,
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

	async login(req: DecodedRequest, res: Response) {
		try {
			const token = req.headers.authorization?.split(' ')[1] || '';
			const data = await DoctorService.login(token);
			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'User logged in successfully',
						data,
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

	portal(req: Request, res: Response) {
		return res.sendFile(path.join(__dirname, '../public/qrcode.html'));
	}

	async assignQuestion(req: DecodedRequest, res: Response) {
		try {
			const {doctorId, questionId} = req.body;

			const result = await DoctorService.assignQuestionToDoctor(
				Number(doctorId),
				Number(questionId),
				req.email,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Question assigned successfully',
						result,
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
}

export default new DoctorsController();
