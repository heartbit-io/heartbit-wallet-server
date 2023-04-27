import {Request, Response} from 'express';
import {HttpCodes} from '../util/HttpCodes';
import FormatResponse from '../lib/FormatResponse';
import ReplyService from '../services/ReplyService';
import QuestionService from '../services/QuestionService';
import TransactionService from '../services/TransactionService';
import UserService from '../services/UserService';
import {firebase} from '../config/firebase-config';
import {
	getAuth,
	signInWithEmailAndPassword,
	sendEmailVerification,
	createUserWithEmailAndPassword,
} from 'firebase/auth';

class UsersController {
	async create(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const user = await UserService.createUser({...req.body});

			//add user details to firebase
			const created_user = await createUserWithEmailAndPassword(
				getAuth(firebase),
				req.body.email,
				req.body.password,
			);

			//send email verification
			await sendEmailVerification(created_user.user);

			return res
				.status(HttpCodes.CREATED)
				.json(
					new FormatResponse(
						true,
						HttpCodes.CREATED,
						'User created successfully',
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

	async login(req: Request, res: Response): Promise<Response<FormatResponse>> {
		try {
			const {email, password} = req.body;

			const login = await signInWithEmailAndPassword(
				getAuth(firebase),
				email,
				password,
			);

			if (!login.user.emailVerified) { 
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'User email is not verified',
							null,
						),
					);
			}

			if (!login.user) { 
				return res
					.status(HttpCodes.UNAUTHORIZED)
					.json(
						new FormatResponse(
							false,
							HttpCodes.UNAUTHORIZED,
							'User email or password is incorrect',
							null,
						),
					);
			}

			const token = await login.user.getIdToken();

			const data = {
				token,
				uid: login.user.uid,
				email: login.user.email,
				emailVerified: login.user.emailVerified,
			}

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

	async getUser(
		req: Request,
		res: Response,
	): Promise<Response<FormatResponse>> {
		try {
			const {pubkey} = req.params;

			const user = await UserService.getUserDetails(pubkey);

			if (!user) {
				return res
					.status(HttpCodes.NOT_FOUND)
					.json(
						new FormatResponse(
							false,
							HttpCodes.NOT_FOUND,
							'User was not found',
							null,
						),
					);
			}

			const user_questions = await QuestionService.getUserQuestions(pubkey);
			const user_replies = await ReplyService.getUserReplies(pubkey);
			const user_transactions = await TransactionService.getUserTransactions(
				pubkey,
			);

			const response = {
				...user.dataValues,
				questions: user_questions,
				replies: user_replies,
				transactions: user_transactions,
			};

			return res
				.status(HttpCodes.OK)
				.json(
					new FormatResponse(
						true,
						HttpCodes.OK,
						'Successfully retrieved user details',
						response,
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
