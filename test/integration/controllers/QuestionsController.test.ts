import {expect} from 'chai';
import {agent as request} from 'supertest';
import {QuestionAttributes} from '../../../src/domains/entities/Question';
import {HttpCodes} from '../../../src/util/HttpCodes';
import {QuestionStatus} from '../../../src/util/enums';
import app from '../../../src/index';
import {newUser, createUser, newQuestion} from '../mocks';
import dataSource, {
	QuestionDataSource,
	userDataSource,
} from '../../../src/domains/repo';

const base_url = '/api/v1';

describe('Questions endpoints', () => {
	before(async () => {
		await dataSource.initialize();
	});
	afterEach(async () => {
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
			.send({
				...question,
			})
			.set('Accept', 'application/json');
	};

	it('should create a question', async () => {
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

	it('should return validator error if bounty amount is greater than user btc balance', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const bountyAmount = user.btcBalance * 2;
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

	it('should return all open questions', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const question = newQuestion();
		const question_body = {
			...question,
			status: QuestionStatus.OPEN,
			userId: createdUser.id,
			bountyAmount: user.btcBalance / 2,
		};

		await createQuestion(question_body);
		const response = await request(app).get(`${base_url}/questions/open`);
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include(
			successResponse(
				true,
				HttpCodes.OK,
				'Successfully retrieved open questions',
			),
		);
		expect(response.body.data).to.be.an('array');
		expect(response.body.data[0].status).to.equal(question_body.status);
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
