import {agent as request} from 'supertest';
import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import {HttpCodes} from '../../../util/HttpCodes';
import app from '../../../index';
import {
	newUser,
	createUser,
	newReply,
	createQuestion,
	newQuestion,
	newDoctorQuestion,
	saveDoctorQuestion,
	createReply,
} from '../../mocks';
import {UserRoles} from '../../../util/enums';
import dataSource, {
	userDataSource,
	QuestionDataSource,
	ReplyDataSource,
} from '../../../domains/repo';
import DoctorQuestionRepository from '../../../Repositories/DoctorQuestionRepository';
import ReplyRepository from '../../../Repositories/ReplyRepository';

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
		expect(response.body.data).to.have.property('presentIllness');
		expect(response.body.data).to.have.property('pastMedicalHistory');
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

	it('should delete doctor-question when a reply is posted by doctor', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		doctorUser.email = 'testemail@heartbit.io';
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const doctorQuestion = newDoctorQuestion();
		doctorQuestion.doctorId = doctor.id;
		doctorQuestion.questionId = createdQuestion.id;
		await saveDoctorQuestion(doctorQuestion);

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
		const deletedDoctorQuestion =
			await DoctorQuestionRepository.getDoctorQuestionStatus(
				doctorQuestion.doctorId,
				doctorQuestion.questionId,
			);
		expect(deletedDoctorQuestion).to.be.null;
	});

	it('should return a question reply', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		doctorUser.airTableRecordId = 'rec123';
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const replyRequest = newReply();
		replyRequest.userId = doctor.id;
		replyRequest.questionId = createdQuestion.id;

		await createReply(replyRequest);

		const response = await request(app)
			.get(base_url + '/questions/' + createdQuestion.id + '/replies')
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include({
			success: true,
			statusCode: HttpCodes.OK,
			message: 'Reply retrieved successfully',
		});
		expect(response.body.data).to.have.property('id');
		expect(response.body.data).to.have.property('content');
		expect(response.body.data).to.have.property('questionId');
		expect(response.body.data).to.have.property('userId');
		expect(response.body.data).to.have.property('title');
		expect(response.body.data).to.have.property('status');
		expect(response.body.data).to.have.property('majorComplaint');
		expect(response.body.data).to.have.property('presentIllness');
	});

	it('should fire an event, receive by listener and update reply', async () => {
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

		const reply = await ReplyRepository.getReplyById(response.body.data.id);
		expect(reply).to.not.be.null;
		expect(reply).to.have.property('translatedContent').to.not.be.null;
		expect(reply).to.have.property('translatedTitle').to.not.be.null;
	});
});
