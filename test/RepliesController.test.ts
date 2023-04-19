import app from '../src/index';
import {expect} from 'chai';
import {agent as request} from 'supertest';
import {HttpCodes} from '../src/util/HttpCodes';
import {faker} from '@faker-js/faker';
import {
	QuestionInstance,
	QuestionAttributes,
} from '../src/models/QuestionModel';
import {UserInstance, UserAttributes} from '../src/models/UserModel';
import {RepliesAttributes} from '../src/models/ReplyModel';
import {ReplyInstance} from '../src/models/ReplyModel';

const base_url = '/api/v1';

describe('Replies endpoints', () => {
	afterEach(async () => {
		await UserInstance.destroy({where: {}, truncate: true});
		await QuestionInstance.destroy({where: {}, truncate: true});
		await ReplyInstance.destroy({where: {}, truncate: true});
	});

	const newUser = () => {
		return {
			pubkey: faker.finance.bitcoinAddress() + new Date().getTime().toString(),
			role: faker.helpers.arrayElement(['user', 'admin', 'doctor']),
			btc_balance: Number(faker.finance.amount()),
		};
	};

	const newQuestion = () => {
		return {
			content: faker.lorem.sentences(),
			bounty_amount: Number(faker.finance.amount()),
			user_pubkey:
				faker.finance.bitcoinAddress() + new Date().getTime().toString(),
		};
	};

	const createUser = async (user: UserAttributes) => {
		const result = await request(app)
			.post(base_url + '/users')
			.send({...user})
			.set('Accept', 'application/json');
		return result;
	};

	const createQuestion = async (question: QuestionAttributes) => {
		return await request(app)
			.post(base_url + '/questions')
			.send({
				...question,
			})
			.set('Accept', 'application/json');
	};

	const createReply = async (reply: RepliesAttributes) => {
		return await request(app)
			.post(base_url + '/replies')
			.send({
				...reply,
			})
			.set('Accept', 'application/json');
	};

	describe('post creating a reply', () => {
		it('should create a reply', async () => {
			const user = newUser();
			await createUser(user);
			const second_user = newUser();
			await createUser(second_user);

			const question = newQuestion();
			const question_body = {
				...question,
				user_pubkey: user.pubkey,
				bounty_amount: user.btc_balance / 2,
			};
			const create_question = await createQuestion(question_body);

			const reply_request = {
				question_id: create_question.body.data.id,
				user_pubkey: second_user.pubkey,
				content: faker.lorem.paragraph(),
			};

			const response = await createReply(reply_request);

			expect(response.status).to.equal(HttpCodes.CREATED);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.CREATED,
				message: 'Reply created successfully',
			});
			expect(response.body.data).to.include({
				question_id: create_question.body.data.id,
				user_pubkey: second_user.pubkey,
			});
		});

		it('should not create a reply if the question does not exist', async () => {
			const user = newUser();
			await createUser(user);
			const second_user = newUser();
			await createUser(second_user);

			const reply_request = {
				user_pubkey: second_user.pubkey,
				content: faker.lorem.paragraph(),
			};

			const response = await request(app)
				.post(base_url + '/replies')
				.send(reply_request)
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should not create a reply if the user does not exist', async () => {
			const user = newUser();
			await createUser(user);

			const question = newQuestion();
			await createQuestion(question);

			const reply_request = {
				user_pubkey: null,
				content: faker.lorem.paragraph(),
			};

			const response = await request(app)
				.post(base_url + '/replies')
				.send(reply_request)
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should not create a reply if content is not supplied', async () => {
			const user = newUser();
			await createUser(user);
			const second_user = newUser();
			await createUser(second_user);

			const question = newQuestion();
			const question_body = {
				...question,
				user_pubkey: user.pubkey,
				bounty_amount: user.btc_balance / 2,
			};
			const create_question = await createQuestion(question_body);

			const reply_request = {
				question_id: create_question.body.data.id,
				user_pubkey: second_user.pubkey,
			};

			const response = await request(app)
				.post(base_url + '/replies')
				.send(reply_request)
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});
	});
	describe('mark reply as best reply', () => {
		it('should mark a reply as best reply', async () => {
			const user = newUser();
			await createUser(user);
			const second_user = newUser();
			await createUser(second_user);

			const question = newQuestion();
			const question_body = {
				...question,
				user_pubkey: user.pubkey,
				bounty_amount: user.btc_balance / 2,
			};
			const create_question = await createQuestion(question_body);

			const reply_request = {
				question_id: create_question.body.data.id,
				user_pubkey: second_user.pubkey,
				content: faker.lorem.paragraph(),
			};

			const reply = await createReply(reply_request);
			const response = await request(app)
				.patch(base_url + '/replies/' + reply.body.data.id )
				.send({
					user_pubkey: user.pubkey,
				})
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.OK);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Successfully mark reply as best reply',
			});
			expect(response.body.data).to.include({
				question_id: create_question.body.data.id,
				user_pubkey: second_user.pubkey,
				best_reply: true,
			})
		});
	});
});
