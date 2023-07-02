// import {
// 	Question,
// 	QuestionAttributes,
// } from '../../../src/domains/entities/Question';
// import {User, UserAttributes} from '../../../src/domains/entities/User';

// import {HttpCodes} from '../../../src/util/HttpCodes';
// import {QuestionStatus} from '../../../src/util/enums';
// import app from '../../../src/index';
// import {expect} from 'chai';
// import {faker} from '@faker-js/faker';
// import {agent as request} from 'supertest';
// import {newUser} from './UsersController.test';

// const base_url = '/api/v1';

// export const newQuestion = () => {
// 	return {
// 		userId: faker.number.int({min: 1, max: 50}),
// 		content: faker.lorem.sentences(),
// 		rawContentLanguage: faker.helpers.arrayElement([
// 			'en',
// 			'fr',
// 			'es',
// 			'de',
// 			'it',
// 		]),
// 		bountyAmount: Number(faker.finance.amount()),
// 		rawContent: faker.lorem.sentences(),
// 		user_email: faker.internet.email(),
// 	};
// };

// describe('Questions endpoints', () => {
// 	afterEach(async () => {
// 		// await User.destroy({where: {}, truncate: true});
// 		// await Question.destroy({where: {}, truncate: true});
// 	});

// 	const createUser = async (user: UserAttributes) => {
// 		const result = await request(app)
// 			.post(base_url + '/users')
// 			.send({...user})
// 			.set('Accept', 'application/json');
// 		return result;
// 	};

// 	const failureResponse = (status: boolean, statusCode: HttpCodes) => {
// 		return {
// 			success: status,
// 			statusCode: statusCode,
// 		};
// 	};

// 	const successResponse = (
// 		status: boolean,
// 		statusCode: HttpCodes,
// 		message: string,
// 	) => {
// 		return {
// 			...failureResponse(status, statusCode),
// 			message,
// 		};
// 	};

// 	const createQuestion = async (question: QuestionAttributes) => {
// 		return await request(app)
// 			.post(base_url + '/questions')
// 			.send({
// 				...question,
// 			})
// 			.set('Accept', 'application/json');
// 	};

// 	describe('create question', () => {
// 		it('should create a question', async () => {
// 			const user = newUser();
// 			await createUser(user);

// 			const question = newQuestion();
// 			const question_request = {
// 				...question,
// 				user_email: user.email,
// 				bounty_amount: user.btcBalance / 2,
// 			};

// 			const response = await createQuestion(question_request);

// 			expect(response.status).to.equal(HttpCodes.CREATED);
// 			expect(response.body).to.include(
// 				successResponse(
// 					true,
// 					HttpCodes.CREATED,
// 					'Question posted successfully',
// 				),
// 			);
// 			expect(response.body.data).to.contain(question_request);
// 		});

// 		it('should return validator error if user public key is not registered', async () => {
// 			const question = newQuestion();
// 			const response = await createQuestion(question);
// 			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
// 			expect(response.body).to.include(
// 				failureResponse(false, HttpCodes.BAD_REQUEST),
// 			);
// 		});

// 		it('should return validator error if bounty amount is higher than user btc balance', async () => {
// 			const user = newUser();
// 			await createUser(user);

// 			const question = newQuestion();
// 			const question_request = {
// 				...question,
// 				user_email: user.email,
// 				bounty_amount: user.btcBalance + 2,
// 			};
// 			const response = await createQuestion(question_request);
// 			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
// 			expect(response.body).to.include(
// 				failureResponse(false, HttpCodes.BAD_REQUEST),
// 			);
// 		});

// 		it('should return validator error role if user public key is not supplied', async () => {
// 			const user = newUser();
// 			await createUser(user);

// 			const question = newQuestion();
// 			const question_request = {
// 				...question,
// 				user_email: null,
// 				bounty_amount: user.btcBalance / 2,
// 			};
// 			const response = await request(app)
// 				.post(base_url + '/questions')
// 				.send(question_request)
// 				.set('Accept', 'application/json');

// 			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
// 			expect(response.body).to.include(
// 				failureResponse(false, HttpCodes.BAD_REQUEST),
// 			);
// 		});

// 		it('should return validator error role if question content is not supplied', async () => {
// 			const user = newUser();
// 			await createUser(user);

// 			const question = newQuestion();
// 			const user_email = user.email;
// 			const content = null;
// 			const bounty_amount = user.btcBalance / 2;
// 			const response = await request(app)
// 				.post(base_url + '/questions')
// 				.send({
// 					...question,
// 					user_email,
// 					content,
// 					bounty_amount,
// 				})
// 				.set('Accept', 'application/json');

// 			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
// 			expect(response.body).to.include(
// 				failureResponse(false, HttpCodes.BAD_REQUEST),
// 			);
// 		});

// 		it('should return validator error role if bounty amount is not supplied', async () => {
// 			const user = newUser();
// 			await createUser(user);

// 			const question = newQuestion();
// 			const user_email = user.email;
// 			const bounty_amount = null;
// 			const response = await request(app)
// 				.post(base_url + '/questions')
// 				.send({
// 					...question,
// 					user_email,
// 					bounty_amount,
// 				})
// 				.set('Accept', 'application/json');

// 			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
// 			expect(response.body).to.include(
// 				failureResponse(false, HttpCodes.BAD_REQUEST),
// 			);
// 		});
// 	});
// 	describe('get all questions', () => {
// 		it('should return all questions', async () => {
// 			const user = newUser();
// 			await createUser(user);
// 			const question = newQuestion();
// 			const question_request = {
// 				...question,
// 				user_email: user.email,
// 				bounty_amount: user.btcBalance / 2,
// 			};
// 			await createQuestion(question_request);

// 			const response = await request(app).get(`${base_url}/questions`);
// 			expect(response.status).to.equal(HttpCodes.OK);
// 			expect(response.body).to.include(
// 				successResponse(
// 					true,
// 					HttpCodes.OK,
// 					'Successfully retrieved all questions',
// 				),
// 			);
// 			expect(response.body.data).to.be.an('array');
// 		});

// 		it('should return all open questions', async () => {
// 			const user = newUser();
// 			await createUser(user);
// 			const question = newQuestion();
// 			const question_body = {
// 				...question,
// 				user_email: user.email,
// 				status: QuestionStatus.OPEN,
// 				bounty_amount: user.btcBalance / 2,
// 			};

// 			await createQuestion(question_body);
// 			const response = await request(app).get(`${base_url}/questions/open`);
// 			expect(response.status).to.equal(HttpCodes.OK);
// 			expect(response.body).to.include(
// 				successResponse(
// 					true,
// 					HttpCodes.OK,
// 					'Successfully retrieved all open questions',
// 				),
// 			);
// 			expect(response.body.data).to.be.an('array');
// 			expect(response.body.data[0].status).to.equal(question_body.status);
// 		});
// 	});
// 	describe('it should get a question by id', () => {
// 		it('should return a question by id', async () => {
// 			const user = newUser();
// 			await createUser(user);
// 			const question = newQuestion();
// 			const question_body = {
// 				...question,
// 				user_email: user.email,
// 				status: QuestionStatus.OPEN,
// 				bounty_amount: user.btcBalance / 2,
// 			};
// 			const create_question = await createQuestion(question_body);

// 			const response = await request(app).get(
// 				`${base_url}/questions/${create_question.body.data.id}`,
// 			);
// 			expect(response.status).to.equal(HttpCodes.OK);
// 			expect(response.body).to.include(
// 				successResponse(
// 					true,
// 					HttpCodes.OK,
// 					'Successfully retrieved question details',
// 				),
// 			);
// 			expect(response.body.data).to.include(question_body);
// 			expect(response.body.data)
// 				.to.have.property('replies')
// 				.that.is.an('array');
// 		});
// 	});

// 	describe('it should delete a question by id', () => {
// 		it('should delete a question by id', async () => {
// 			const user = newUser();
// 			await createUser(user);
// 			const question = newQuestion();
// 			const question_body = {
// 				...question,
// 				user_email: user.email,
// 				status: QuestionStatus.OPEN,
// 				bounty_amount: user.btcBalance / 2,
// 			};

// 			const create_question = await createQuestion(question_body);

// 			const response = await request(app)
// 				.delete(`${base_url}/questions/${create_question.body.data.id}`)
// 				.send({
// 					user_email: question_body.user_email,
// 				})
// 				.set('Accept', 'application/json');
// 			expect(response.status).to.equal(HttpCodes.OK);
// 			expect(response.body).to.include(
// 				successResponse(true, HttpCodes.OK, 'Question deleted successfully'),
// 			);
// 		});
// 	});
// });
