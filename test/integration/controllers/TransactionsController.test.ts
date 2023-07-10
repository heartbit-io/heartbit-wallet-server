import {expect} from 'chai';
import {agent as request} from 'supertest';
import {afterEach, after} from 'mocha';
import {HttpCodes} from '../../../src/util/HttpCodes';
import app from '../../../src/index';
import dataSource, {
	BtcTransactionDataSource,
	QuestionDataSource,
	userDataSource,
} from '../../../src/domains/repo';
import {
	newUser,
	createUser,
	newQuestion,
	createQuestion,
	newBtcTransaction,
	createBtcTransaction,
} from '../mocks';

const base_url = '/api/v1';

describe('Transactions endpoints', () => {
	afterEach(async () => {
		await BtcTransactionDataSource.delete({});
		await QuestionDataSource.delete({});
		await userDataSource.delete({});
	});
	before(async () => {
		await dataSource.initialize();
	});
	after(async () => {
		await dataSource.destroy();
	});

	describe('get user transactions', () => {
		it('should return all user transactions', async () => {
			const user = newUser();
			user.email = 'testemail@heartbit.io';
			const createdUser = await createUser(user);
			const doctor = newUser();
			const createdSecondUser = await createUser(doctor);

			const question = newQuestion();
			const question_body = {
				...question,
				userId: createdUser.id,
				bountyAmount: user.btcBalance / 2,
			};
			await createQuestion(question_body);

			const btcTransaction = newBtcTransaction();
			btcTransaction.fromUserPubkey = createdUser.pubkey;
			btcTransaction.toUserPubkey = doctor.pubkey;
			const result = await createBtcTransaction(btcTransaction);

			const response = await request(app)
				.get(base_url + '/transactions/' + result.fromUserPubkey)
				.set('Accept', 'application/json');
			expect(response.status).to.equal(HttpCodes.OK);
			expect(response.body.data.transactions).to.be.an('array');
			expect(response.body.data.transactions[0].fromUserPubkey).to.equal(
				result.fromUserPubkey,
			);
			expect(response.body.data.transactions[0].toUserPubkey).to.equal(
				result.toUserPubkey,
			);
		});
	});
});
