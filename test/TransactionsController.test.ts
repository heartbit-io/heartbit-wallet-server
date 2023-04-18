import app from '../src/index';
import {expect} from 'chai';
import {agent as request} from 'supertest';
import {HttpCodes} from '../src/util/HttpCodes';
import {faker} from '@faker-js/faker';
import {QuestionInstance} from '../src/models/QuestionModel';
import {UserInstance} from '../src/models/UserModel';
import {QuestionAttributes} from '../src/models/QuestionModel';
import {UserAttributes} from '../src/models/UserModel';
import {RepliesAttributes} from '../src/models/ReplyModel';
import {TransactionInstance} from '../src/models/TransactionModel';

const base_url = '/api/v1';

describe('Transactions endpoints', () => {
	afterEach(async () => {
		await UserInstance.destroy({where: {}, truncate: true});
		await QuestionInstance.destroy({where: {}, truncate: true});
		await TransactionInstance.destroy({where: {}, truncate: true});
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
			});
	};

	describe('get user transactions', () => {
		it('should return all user transactions', async () => {
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
			await request(app)
				.patch(base_url + '/replies/' + reply.body.data.id )
				.send({
					user_pubkey: user.pubkey,
				})
                .set('Accept', 'application/json');
            
            const response = await request(app)
                .get(base_url + '/transactions/' + user.pubkey)
                .set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.OK);
            expect(response.body.data).to.be.an('array');
		});
	});
});
