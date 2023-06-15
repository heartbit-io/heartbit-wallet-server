import {Request, Response} from 'express';

import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import ReplyService from '../services/ReplyService';
import {ReplyTypes} from '../util/enums/replyTypes';
import ResponseDto from '../dto/ResponseDTO';

export interface ReplyResponseInterface extends FormatResponse {
	data: {
		replyType: ReplyTypes;
		name: string;
		classification: string;
		reply: string;
		createdAt: Date;
		plan?: string;
		majorComplaint?: string;
		medicalHistory?: string;
		currentMedications?: string;
		assessment?: string;
		triage?: string;
		content?: string;
	};
}

class RepliesController {
	async createChatGPTReply(
		req: Request,
		res: Response,
	): Promise<Response<ReplyResponseInterface>> {
		try {
			// set response
			const replyResponseInterface: ReplyResponseInterface =
				await ReplyService.createChatGPTReply(req.body);

			return res.status(HttpCodes.CREATED).json(replyResponseInterface);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(false, HttpCodes.INTERNAL_SERVER_ERROR, error, null),
				);
		}
	}

	async get(
		req: Request,
		res: Response,
	): Promise<Response<ReplyResponseInterface>> {
		try {
			const {questionId} = req.params;
			const reply = await ReplyService.getReplyByQuestionId(Number(questionId));

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(true, HttpCodes.OK, 'Reply get successfully', reply),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(false, HttpCodes.INTERNAL_SERVER_ERROR, error, null),
				);
		}
	}

	async delete(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const {replyId} = req.params;

			await ReplyService.deleteReply(Number(replyId), Number(req.body.userId));

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Reply deleted successfully',
						null,
					),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(false, HttpCodes.INTERNAL_SERVER_ERROR, error, null),
				);
		}
	}
}

export default new RepliesController();
