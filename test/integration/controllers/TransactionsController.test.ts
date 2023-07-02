// import {HttpCodes} from '../../../src/util/HttpCodes';
// import {
// 	QuestionAttributes,
// 	Question,
// } from '../../../src/domains/entities/Question';
// import {RepliesAttributes} from '../../../src/domains/entities/Reply';
// import {
// 	BtcTransaction,
// 	BtcTransactionFields,
// } from '../../../src/domains/entities/BtcTransaction';
// import {User, UserAttributes} from '../../../src/domains/entities/User';
// import app from '../../../src/index';
// import {expect} from 'chai';
// import {faker} from '@faker-js/faker';
// import {agent as request} from 'supertest';
// import {newUser} from './UsersController.test';
// import {newQuestion} from './QuestionsController.test';

// const base_url = '/api/v1';

// describe('Transactions endpoints', () => {
// 	afterEach(async () => {
// 		// await User.destroy({where: {}, truncate: true});
// 		// await Question.destroy({where: {}, truncate: true});
// 		// await BtcTransaction.destroy({where: {}, truncate: true});
// 	});

// 	const createUser = async (user: UserAttributes) => {
// 		const result = await request(app)
// 			.post(base_url + '/users')
// 			.send({...user})
// 			.set('Accept', 'application/json');
// 		return result;
// 	};

// 	const createQuestion = async (question: QuestionAttributes) => {
// 		return await request(app)
// 			.post(base_url + '/questions')
// 			.send({
// 				...question,
// 			})
// 			.set('Accept', 'application/json');
// 	};

// 	const createReply = async (reply: RepliesAttributes) => {
// 		return await request(app)
// 			.post(base_url + '/replies')
// 			.send({
// 				...reply,
// 			});
// 	};

// 	// describe('get user transactions', () => {
// 	// 	it('should return all user transactions', async () => {
// 	// 		const user = newUser();
// 	// 		await createUser(user);
// 	// 		const second_user = newUser();
// 	// 		await createUser(second_user);

// 	// 		const question = newQuestion();
// 	// 		const question_body = {
// 	// 			...question,
// 	// 			user_email: user.email,
// 	// 			bounty_amount: user.btcBalance / 2,
// 	// 		};
// 	// 		const create_question = await createQuestion(question_body);

// 	// 		const reply_request = {
// 	// 			question_id: create_question.body.data.id,
// 	// 			user_email: second_user.email,
// 	// 			content: faker.lorem.paragraph(),
// 	// 		};

// 	// 		const reply = await createReply(reply_request);
// 	// 		await request(app)
// 	// 			.patch(base_url + '/replies/' + reply.body.data.id)
// 	// 			.send({
// 	// 				user_email: user.email,
// 	// 			})
// 	// 			.set('Accept', 'application/json');

// 	// 		const response = await request(app)
// 	// 			.get(base_url + '/transactions/' + user.pubkey)
// 	// 			.set('Accept', 'application/json');

// 	// 		expect(response.status).to.equal(HttpCodes.OK);
// 	// 		expect(response.body.data).to.be.an('array');
// 	// 	});
// 	// });
// });
