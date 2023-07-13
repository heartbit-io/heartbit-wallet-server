import {expect} from 'chai';
import {agent as request} from 'supertest';
import {QuestionAttributes} from '../../../src/domains/entities/Question';
import {HttpCodes} from '../../../src/util/HttpCodes';
import {QuestionStatus, UserRoles} from '../../../src/util/enums';
import app from '../../../src/index';
import {
	newUser,
	createUser,
	newQuestion,
	createQuestion,
	chatGptReply,
	createChatGptReply,
} from '../mocks';
import dataSource, {
	QuestionDataSource,
	userDataSource,
} from '../../../src/domains/repo';

const base_url = '/api/v1';

describe('Doctor endpoints', () => {
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

	it('should get question with the highest bounty', async () => {
		const firstUser = newUser();
		firstUser.btcBalance = 1000;
		const createdUser = await createUser(firstUser);

		const firstQuestion = newQuestion();
		firstQuestion.userId = createdUser.id;
		firstQuestion.status = QuestionStatus.OPEN;
		firstQuestion.bountyAmount = 500;
		const createdQuestion = await createQuestion(firstQuestion);
		const newChatGptReply = chatGptReply();
		newChatGptReply.questionId = createdQuestion.id;
		await createChatGptReply(newChatGptReply);

		const secondUser = newUser();
		secondUser.btcBalance = 2000;
		const createdSecondUser = await createUser(secondUser);
		const secondQuestion = newQuestion();
		secondQuestion.bountyAmount = 1000;
		secondQuestion.userId = createdSecondUser.id;
		secondQuestion.status = QuestionStatus.OPEN;
		const createdSecondQuestion = await createQuestion(secondQuestion);
		const secondReply = chatGptReply();
		secondReply.questionId = createdSecondQuestion.id;
		await createChatGptReply(secondReply);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		doctorUser.email = 'testemail@heartbit.io';
		await createUser(doctorUser);

		const response = await request(app)
			.get(base_url + '/doctors/questions')
			.set('Accept', 'application/json');

		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body.data).to.be.an('object');
		expect(response.body.data).to.have.property('id');
		expect(response.body.data)
			.to.have.property('status')
			.to.equal(QuestionStatus.OPEN);
		expect(response.body.data)
			.to.have.property('bountyAmount')
			.to.equal(Number(1000).toString());
		expect(response.body.data)
			.to.have.property('userId')
			.to.equal(createdSecondUser.id);
	});
});
