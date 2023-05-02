import {Response} from 'express';

import {DecodedRequest} from '../middleware/Auth';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';
import QuestionService from '../services/QuestionService';
import ReplyService from '../services/ReplyService';
import UserService from '../services/UserService';
import TransactionService from '../services/TransactionService';
import {UserRoles} from '../util/enums/userRoles';

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
			//check that it is a doctor
			const doctor = await UserService.getUserDetails(email);

			//TODO[Peter]: Extract this into a middleware to check if the user is a doctor

			if (!doctor || doctor.role !== UserRoles.DOCTOR) {
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'User must be a doctor to reply to a question',
							null,
						),
					);
			}

			const question = await QuestionService.getQuestion(req.body.question_id);

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

			//create a transaction
			const user = await UserService.getUserDetails(question.user_email);

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

			//debit user bounty amount
			const user_balance = user.btc_balance - question.bounty_amount;

			const user_debit = UserService.updateUserBtcBalance(
				user_balance,
				user.pubkey,
			);

			if (!user_debit) {
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

			const doctorBalance = doctor.btc_balance + question.bounty_amount;
			const creditDoctor = await UserService.updateUserBtcBalance(
				doctorBalance,
				doctor.pubkey,
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
				amount: question.bounty_amount,
				to_user_pubkey: doctor.pubkey,
				from_user_pubkey: user.pubkey,
			});

			const reply = await ReplyService.createReply({
				...req.body,
				user_email: email,
			});

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
        const doctor = await UserService.getUserDetails(req.email);
        
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

		const openQuestions = await QuestionService.getOpenQuestionsOrderByBounty();

		return res
			.status(HttpCodes.OK)
			.json(
				new FormatResponse(
					true,
					HttpCodes.OK,
					'Questions retrieved successfully',
					openQuestions,
				),
			);
	}
}

export default new DoctorsController();
