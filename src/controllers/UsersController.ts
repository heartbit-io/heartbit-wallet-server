import {Request, Response} from 'express';
import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import ResponseDto from '../dto/ResponseDTO';
import UserService from '../services/UserService';
import FcmService from '../services/FcmService';

class UsersController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		const createdUser = await UserService.createUser(req.body);
		try {
			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'User login/signup successful',
						createdUser,
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

	async getUser(
		req: DecodedRequest,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const user = await UserService.getUser(req.email);

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved user details',
						user,
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

	async updateFcmToken(req: DecodedRequest, res: Response) {
		try {
			const user = await FcmService.updateUserFcmToken(
				req.body.token,
				req.email,
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully updated user fcm token',
						user,
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
}

export default new UsersController();
