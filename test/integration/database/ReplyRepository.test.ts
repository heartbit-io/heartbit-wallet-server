import {faker} from '@faker-js/faker';
import {expect, use} from 'chai';
import dataSource, {
	QuestionDataSource,
	ReplyDataSource,
	userDataSource,
} from '../../../src/domains/repo';
import {afterEach, after, before} from 'mocha';
import ReplyRepository from '../../../src/Repositories/ReplyRepository';
import {ReplyStatus, UserRoles} from '../../../src/util/enums';
import {RepliesAttributes} from '../../../src/domains/entities/Reply';
import {newUser, createUser} from './UserRepository.test';
import {newQuestion, createQuestion} from './QuestionRepository.test';

describe('Replies Repository queries', () => {
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

	const newReply = () => {
		return {
			id: faker.number.int({min: 1, max: 50}),
			questionId: faker.number.int({min: 1, max: 50}),
			userId: faker.number.int({min: 1, max: 50}),
			title: faker.lorem.sentence(),
			content: faker.lorem.paragraph(),
			status: faker.helpers.arrayElement(Object.values(ReplyStatus)),
			majorComplaint: faker.lorem.sentence(),
			medicalHistory: faker.lorem.sentence(),
			currentMedications: faker.lorem.sentence(),
			assessment: faker.lorem.sentence(),
			plan: faker.lorem.sentence(),
			triage: faker.lorem.sentence(),
			doctorNote: faker.lorem.sentence(),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			deletedAt: null,
		};
	};

	const createReply = async (reply: RepliesAttributes) => {
		return await ReplyRepository.createReply(reply);
	};

	it('should create a reply', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const reply = newReply();
		reply.userId = doctor.id;
		reply.questionId = createdQuestion.id;
		const result = await createReply(reply);

		expect(result).to.be.an('object');
		expect(result).to.have.property('id');
		expect(result).to.have.property('questionId');
		expect(result).to.have.property('userId');
		expect(result).to.have.property('title');
		expect(result).to.have.property('content');
		expect(result).to.have.property('status');
		expect(result).to.have.property('majorComplaint');
		expect(result).to.have.property('medicalHistory');
		expect(result).to.have.property('currentMedications');
		expect(result).to.have.property('assessment');
		expect(result).to.have.property('plan');
		expect(result).to.have.property('triage');
		expect(result).to.have.property('doctorNote');
		expect(result).to.have.property('createdAt');
		expect(result).to.have.property('updatedAt');
		expect(result).to.have.property('deletedAt');
	});

	it('should get reply by id', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const reply = newReply();
		reply.userId = doctor.id;
		reply.questionId = createdQuestion.id;
		const createdReply = await createReply(reply);

		const replyById = await ReplyRepository.getReplyById(createdReply.id);
		expect(replyById).to.be.an('object');
		expect(replyById).to.have.property('id').to.equal(createdReply.id);
	});

	it('should get reply by userId', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const reply = newReply();
		reply.userId = doctor.id;
		reply.questionId = createdQuestion.id;
		await createReply(reply);

		const replyByUserId = await ReplyRepository.getUserReplies(doctor.id);
		expect(replyByUserId).to.be.an('array');
		expect(replyByUserId[0]).to.have.property('id');
		expect(replyByUserId[0])
			.to.have.property('questionId')
			.to.equal(createdQuestion.id);
		expect(replyByUserId[0]).to.have.property('userId').to.equal(doctor.id);
	});

	it('should get question reply', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const reply = newReply();
		reply.userId = doctor.id;
		reply.questionId = createdQuestion.id;
		await createReply(reply);
		const questionReplies = await ReplyRepository.getReplyByQuestionId(
			createdQuestion.id,
		);
		expect(questionReplies).to.be.an('object');
		expect(questionReplies).to.have.property('id');
		expect(questionReplies)
			.to.have.property('questionId')
			.to.equal(createdQuestion.id);
	});

	it('should soft delete a reply', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const reply = newReply();
		reply.userId = doctor.id;
		reply.questionId = createdQuestion.id;
		const createdReply = await createReply(reply);

		await ReplyRepository.deleteReply(createdReply.id);
		const deletedReply = await ReplyDataSource.findOne({
			where: {id: createdReply.id},
			withDeleted: true,
		});
		expect(deletedReply).to.be.an('object');
		expect(deletedReply).to.have.property('id').to.equal(createdReply.id);
		expect(deletedReply).to.have.property('deletedAt').not.to.equal(null);
	});

	it('should get doctor reply', async () => {
		const user = newUser();
		const createdUser = await createUser(user);

		const doctorUser = newUser();
		doctorUser.role = UserRoles.DOCTOR;
		const doctor = await createUser(doctorUser);

		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);

		const reply = newReply();
		reply.userId = doctor.id;
		reply.questionId = createdQuestion.id;
		await createReply(reply);

		const doctorReply = await ReplyRepository.getDoctorReply(
			createdQuestion.id,
			doctor.id,
		);

		expect(doctorReply).to.be.an('object');
		expect(doctorReply).to.have.property('id');
		expect(doctorReply)
			.to.have.property('questionId')
			.to.equal(createdQuestion.id);
		expect(doctorReply).to.have.property('userId').to.equal(doctor.id);
	});
});
