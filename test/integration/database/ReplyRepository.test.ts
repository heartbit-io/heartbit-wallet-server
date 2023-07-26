import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import dataSource, {
	QuestionDataSource,
	ReplyDataSource,
	userDataSource,
} from '../../../src/domains/repo';
import ReplyRepository from '../../../src/Repositories/ReplyRepository';
import {UserRoles} from '../../../src/util/enums';
import {
	newQuestion,
	createQuestion,
	newUser,
	createUser,
	newReply,
	createReply,
} from '../mocks';

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
		expect(result).to.have.property('presentIllness');
		expect(result).to.have.property('pastMedicalHistory');
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

		const replyByUserId = await ReplyRepository.getDoctorReplies(doctor.id);
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

	it('should get doctor Id by question id', async () => {
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

		const doctorId = await ReplyRepository.getDoctorIdByQuestionId(
			createdQuestion.id,
		);

		expect(doctorId).to.equal(doctor.id);
	});
});
