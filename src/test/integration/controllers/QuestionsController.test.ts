import {expect} from 'chai';
import {agent as request} from 'supertest';
import {QuestionAttributes} from '../../../domains/entities/Question';
import {HttpCodes} from '../../../util/HttpCodes';
import app from '../../../index';
import {newUser, createUser, newQuestion} from '../../mocks';
import dataSource, {
	ChatGPTDataSource,
	QuestionDataSource,
	userDataSource,
} from '../../../domains/repo';
import UserRepository from '../../../Repositories/UserRepository';
import {QuestionStatus} from '../../../util/enums';

const base_url = '/api/v1';

describe('Questions endpoints', () => {
	before(async () => {
		await dataSource.initialize();
	});
	afterEach(async () => {
		await ChatGPTDataSource.delete({});
		await QuestionDataSource.delete({});
		await userDataSource.delete({});
	});
	after(async () => {
		await dataSource.destroy();
	});

	const failureResponse = (status: boolean, statusCode: HttpCodes) => {
		return {
			success: status,
			statusCode: statusCode,
		};
	};

	const successResponse = (
		status: boolean,
		statusCode: HttpCodes,
		message: string,
	) => {
		return {
			...failureResponse(status, statusCode),
			message,
		};
	};

	const createQuestion = async (question: QuestionAttributes) => {
		return await request(app)
			.post(base_url + '/questions')
			.send(question)
			.set('Accept', 'application/json');
	};

	it('should create a question', async () => {
		const userData = newUser();
		userData.email = 'testemail@heartbit.io';
		const user = await createUser(userData);
		const bountyAmount = user.btcBalance / 2;
		const question = newQuestion();
		question.userId = user.id;
		question.bountyAmount = bountyAmount;
		question.status = QuestionStatus.OPEN;
		const response = await createQuestion(question);
		expect(response.status).to.equal(HttpCodes.CREATED);
		expect(response.body).to.include(
			successResponse(true, HttpCodes.CREATED, 'Question posted successfully'),
		);
		expect(response.body.data)
			.to.have.property('content')
			.to.equal(question.content);
		expect(response.body.data)
			.to.have.property('rawContentLanguage')
			.to.equal('EN');
		expect(response.body.data).to.have.property('userId');
		expect(response.body.data)
			.to.have.property('bountyAmount')
			.to.equal(bountyAmount.toString());
		expect(response.body.data)
			.to.have.property('status')
			.to.equal(question.status);
	});

	it('should substract question bounty amount from user btc balance', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const bountyAmount = user.btcBalance / 2;
		const question = newQuestion();
		const question_request = {
			...question,
			userId: createdUser.id,
			bountyAmount,
		};

		const response = await createQuestion(question_request);
		const userDetails = await UserRepository.getUserDetailsById(createdUser.id);
		expect(response.status).to.equal(HttpCodes.CREATED);
		if (!userDetails) throw new Error('User not found');
		expect(userDetails.btcBalance).to.equal(
			Number(user.btcBalance - bountyAmount).toString(),
		);
	});

	it('should deduct promotion btc balance if available', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		user.promotionBtcBalance = 1000;
		const createdUser = await createUser(user);
		const bountyAmount = user.promotionBtcBalance / 2;
		const question = newQuestion();
		const question_request = {
			...question,
			userId: createdUser.id,
			bountyAmount,
		};

		const response = await createQuestion(question_request);
		const userDetails = await UserRepository.getUserDetailsById(createdUser.id);
		expect(response.status).to.equal(HttpCodes.CREATED);
		if (!userDetails) throw new Error('User not found');
		expect(userDetails.btcBalance).to.equal(Number(user.btcBalance).toString());
		expect(userDetails.promotionBtcBalance).to.equal(
			Number(user.promotionBtcBalance - bountyAmount).toString(),
		);
	});

	it('should deduct promotion btc balance if available and deduct from btc balance if promotion btc balance is not enough', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		user.promotionBtcBalance = 1000;
		user.btcBalance = 1000;
		const createdUser = await createUser(user);
		const halfBtcBalance = user.btcBalance / 2;
		const bountyAmount = user.promotionBtcBalance + halfBtcBalance;
		const question = newQuestion();
		const question_request = {
			...question,
			userId: createdUser.id,
			bountyAmount,
		};

		const response = await createQuestion(question_request);
		const userDetails = await UserRepository.getUserDetailsById(createdUser.id);
		expect(response.status).to.equal(HttpCodes.CREATED);
		if (!userDetails) throw new Error('User not found');
		expect(userDetails.btcBalance).to.equal(halfBtcBalance.toString());
		expect(userDetails.promotionBtcBalance).to.equal('0');
	});

	it('should return validator error if bounty amount is greater than user btc balance', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const bountyAmount = Number(user.btcBalance) * 2;
		const question = newQuestion();
		const question_request = {
			...question,
			bountyAmount,
			userId: createdUser.id,
		};

		const response = await createQuestion(question_request);
		expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
		expect(response.body).to.include(
			failureResponse(false, HttpCodes.BAD_REQUEST),
		);
		expect(response.body)
			.to.have.property('message')
			.to.equal('Insufficient balance to create question');
	});

	it('should return validator error role if question content is not supplied', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const bountyAmount = user.btcBalance / 2;
		const question = newQuestion();
		const question_request = {
			...question,
			userId: createdUser.id,
			bountyAmount,
			content: '',
		};

		const response = await createQuestion(question_request);
		expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
		expect(response.body).to.include(
			failureResponse(false, HttpCodes.BAD_REQUEST),
		);
	});

	it('should return all questions', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		await createQuestion(question2);

		const response = await request(app).get(`${base_url}/questions`);
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body.data.questions).to.be.an('array');
	});

	it('should return a question by id', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const question = newQuestion();
		const question_body = {
			...question,
			bountyAmount: user.btcBalance / 2,
			userId: createdUser.id,
		};

		const createdQuestion = await createQuestion(question_body);
		const response = await request(app).get(
			`${base_url}/questions/${createdQuestion.body.data.id}`,
		);
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include(
			successResponse(
				true,
				HttpCodes.OK,
				'Successfully retrieved question details',
			),
		);
		expect(response.body.data).to.be.an('object');
		expect(response.body.data).to.have.property('id');
		expect(response.body.data).to.have.property('content');
		expect(response.body.data).to.have.property('rawContentLanguage');
		expect(response.body.data).to.have.property('userId');
		expect(response.body.data).to.have.property('bountyAmount');
		expect(response.body.data).to.have.property('status');
		expect(response.body.data).to.have.property('createdAt');
	});

	it('should delete a question by id', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const question = newQuestion();
		const question_body = {
			...question,
			bountyAmount: user.btcBalance / 2,
			userId: createdUser.id,
		};

		const create_question = await createQuestion(question_body);
		const response = await request(app)
			.delete(`${base_url}/questions/${create_question.body.data.id}`)
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include(
			successResponse(true, HttpCodes.OK, 'Question deleted successfully'),
		);
	});
});
