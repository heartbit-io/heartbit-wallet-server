import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import dataSource, {
	DoctorQuestionDataSource,
	QuestionDataSource,
	userDataSource,
} from '../../../domains/repo';
import {newDoctorQuestion, saveDoctorQuestion} from '../../mocks';
import DoctorQuestionRepository from '../../../Repositories/DoctorQuestionRepository';

describe('Doctor-Question Repository queries', () => {
	before(async () => {
		await dataSource.initialize();
	});
	after(async () => {
		dataSource.destroy();
	});
	afterEach(async () => {
		await DoctorQuestionDataSource.delete({});
		await QuestionDataSource.delete({});
		await userDataSource.delete({});
	});

	it('should create a doctor-question', async () => {
		const doctorQuestion = newDoctorQuestion();
		const response = await DoctorQuestionRepository.createDoctorQuestion(
			doctorQuestion,
		);
		expect(response).to.be.an('object');
		expect(response).to.have.property('id');
		expect(response)
			.to.have.property('doctorId')
			.to.equal(doctorQuestion.doctorId);
		expect(response)
			.to.have.property('questionId')
			.to.equal(doctorQuestion.questionId);
		expect(response).to.have.property('createdAt');
		expect(response).to.have.property('updatedAt');
	});

	it('should get a doctor-question', async () => {
		const doctorQuestion = newDoctorQuestion();
		await saveDoctorQuestion(doctorQuestion);

		const response = await DoctorQuestionRepository.getDoctorQuestionStatus(
			doctorQuestion.doctorId,
			doctorQuestion.questionId,
		);
		expect(response).to.be.an('object');
		expect(response).to.have.property('id');
		expect(response)
			.to.have.property('doctorId')
			.to.equal(doctorQuestion.doctorId);
		expect(response)
			.to.have.property('questionId')
			.to.equal(doctorQuestion.questionId);
		expect(response).to.have.property('createdAt');
		expect(response).to.have.property('updatedAt');
	});

	it('should delete doctor-question', async () => {
		const doctorQuestion = newDoctorQuestion();
		await saveDoctorQuestion(doctorQuestion);

		await DoctorQuestionRepository.deleteDoctorQuestion(
			doctorQuestion.doctorId,
			doctorQuestion.questionId,
		);

		const response = await DoctorQuestionRepository.getDoctorQuestionStatus(
			doctorQuestion.doctorId,
			doctorQuestion.questionId,
		);
		expect(response).to.be.null;
	});

	it('should get assigned doctor ID by question Id', async () => {
		const doctorQuestion = newDoctorQuestion();
		await saveDoctorQuestion(doctorQuestion);

		const response = await DoctorQuestionRepository.getAssignedDoctorId(
			doctorQuestion.questionId,
		);
		expect(response).to.equal(doctorQuestion.doctorId);
	});

	it('should get doctor question', async () => {
		const doctorQuestion = newDoctorQuestion();
		const createdDQ = await saveDoctorQuestion(doctorQuestion);

		const anotherQuestion = newDoctorQuestion();
		anotherQuestion.doctorId = doctorQuestion.doctorId;
		await saveDoctorQuestion(anotherQuestion);

		const response = await DoctorQuestionRepository.getDoctorQuestions(
			doctorQuestion.doctorId,
		);
		expect(response).to.be.an('object');
		expect(response)
			.to.have.property('questionId')
			.to.equal(createdDQ.questionId);
	});
});
