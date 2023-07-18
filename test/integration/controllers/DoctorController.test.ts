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
	newDoctorQuestion,
	saveDoctorQuestion,
} from '../mocks';
import dataSource, {
	ChatGPTDataSource,
	QuestionDataSource,
	userDataSource,
} from '../../../src/domains/repo';
import QuestionRepository from '../../../src/Repositories/QuestionRepository';

const base_url = '/api/v1';

describe('Doctor endpoints', () => {
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

	it('should get question with the highest bounty', async () => {
		const firstUser = newUser();
		const createdUser = await createUser(firstUser);

		const firstQuestion = newQuestion();
		firstQuestion.userId = createdUser.id;
		firstQuestion.status = QuestionStatus.OPEN;
		firstQuestion.bountyAmount = 500;
		const createdQuestion = await createQuestion(firstQuestion);
		const newChatGptReply = chatGptReply();
		newChatGptReply.questionId = createdQuestion.id;
		await createChatGptReply(newChatGptReply);

		const secondQuestion = newQuestion();
		secondQuestion.bountyAmount = 1000;
		secondQuestion.userId = createdUser.id;
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
			.get(base_url + '/doctors/questions?index=0')
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
			.to.equal(createdUser.id);
	});

	it('should assign question to doctor', async () => {
		const firstUser = newUser();
		firstUser.btcBalance = 1000;
		const user = await createUser(firstUser);

		const firstQuestion = newQuestion();
		firstQuestion.userId = user.id;
		firstQuestion.status = QuestionStatus.OPEN;
		firstQuestion.bountyAmount = 500;
		const createdQuestion = await createQuestion(firstQuestion);
		const newChatGptReply = chatGptReply();
		newChatGptReply.questionId = createdQuestion.id;
		await createChatGptReply(newChatGptReply);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		doctorUser.email = 'testemail@heartbit.io';
		const createdDoctor = await createUser(doctorUser);

		const response = await request(app)
			.post(base_url + '/doctors/assign-question')
			.send({
				doctorId: createdDoctor.id,
				questionId: createdQuestion.id,
			})
			.set('Accept', 'application/json');
		const assignedQuestion = await QuestionRepository.getQuestion(
			createdQuestion.id,
		);
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body.data).to.be.an('object');
		expect(response.body.data).to.have.property('id');
		expect(response.body.data)
			.to.have.property('doctorId')
			.to.equal(createdDoctor.id);
		expect(response.body.data)
			.to.have.property('questionId')
			.to.equal(createdQuestion.id);
		expect(assignedQuestion)
			.to.have.property('status')
			.to.equal(QuestionStatus.ASSIGNED);
	});

	it('should not reassign same question to another doctor', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const question = newQuestion();
		question.userId = createdUser.id;
		question.status = QuestionStatus.ASSIGNED;
		const createdQuestion = await createQuestion(question);
		const newChatGptReply = chatGptReply();
		newChatGptReply.questionId = createdQuestion.id;
		await createChatGptReply(newChatGptReply);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		doctorUser.email = 'testemail@heartbit.io';
		const createdDoctor = await createUser(doctorUser);

		const doctorQuestion = newDoctorQuestion();
		doctorQuestion.doctorId = createdDoctor.id;
		doctorQuestion.questionId = createdQuestion.id;
		await saveDoctorQuestion(doctorQuestion);

		const response = await request(app)
			.post(base_url + '/doctors/assign-question')
			.send({
				doctorId: createdDoctor.id,
				questionId: createdQuestion.id,
			})
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
		expect(response.body.message).to.equal(
			'Question not found or is no longer open',
		);
	});
});
