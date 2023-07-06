import {agent as request} from 'supertest';
import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import {HttpCodes} from '../../../src/util/HttpCodes';
import app from '../../../src/index';
import {
	newUser,
	createUser,
	newReply,
	createQuestion,
	newQuestion,
} from '../mocks';
import {UserRoles} from '../../../src/util/enums';
import dataSource, {
	userDataSource,
	QuestionDataSource,
	ReplyDataSource,
} from '../../../src/domains/repo';

const base_url = '/api/v1';

describe('Replies endpoints', () => {
	before(async () => {
		await dataSource.initialize();
	});
	afterEach(async () => {
		await ReplyDataSource.delete({});
		await QuestionDataSource.delete({});
		await userDataSource.delete({});
	});
	after(async () => {
		await dataSource.destroy();
	});

	it('should create a reply', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		doctorUser.email = 'testemail@heartbit.io';
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const replyRequest = newReply();
		replyRequest.userId = doctor.id;
		replyRequest.questionId = createdQuestion.id;

		const response = await request(app)
			.post(base_url + '/replies')
			.send(replyRequest)
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.CREATED);
		expect(response.body).to.include({
			success: true,
			statusCode: HttpCodes.CREATED,
			message: 'Reply created successfully',
		});
		expect(response.body.data).to.have.property('id');
		expect(response.body.data).to.have.property('content');
		expect(response.body.data).to.have.property('questionId');
		expect(response.body.data).to.have.property('userId');
		expect(response.body.data).to.have.property('title');
		expect(response.body.data).to.have.property('status');
		expect(response.body.data).to.have.property('majorComplaint');
		expect(response.body.data).to.have.property('medicalHistory');
		expect(response.body.data).to.have.property('currentMedications');
		expect(response.body.data).to.have.property('assessment');
		expect(response.body.data).to.have.property('plan');
		expect(response.body.data).to.have.property('doctorNote');
	});

	it('should not create a reply if the question does not exist', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		doctorUser.email = 'testemail@heartbit.io';
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const replyRequest = newReply();
		replyRequest.userId = doctor.id;
		replyRequest.questionId = createdQuestion.id + 1;

		const response = await request(app)
			.post(base_url + '/replies')
			.send(replyRequest)
			.set('Accept', 'application/json');

		expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
		expect(response.body).to.include({
			success: false,
			statusCode: HttpCodes.BAD_REQUEST,
		});
	});
});
