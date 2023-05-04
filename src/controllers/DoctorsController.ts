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
