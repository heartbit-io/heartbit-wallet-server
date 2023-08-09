import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import dataSource, {
	ChatGPTDataSource,
	QuestionDataSource,
	userDataSource,
} from '../../../src/domains/repo';
import {
	createQuestion,
	createUser,
	newQuestion,
	newUser,
	chatGptReply,
	createChatGptReply,
} from '../../mocks';
import ChatGptRepository from '../../../src/Repositories/ChatGptRepository';

describe('ChaptGpt Repository queries', () => {
	before(async () => {
		await dataSource.initialize();
	});
	after(async () => {
		dataSource.destroy();
	});
	afterEach(async () => {
		await ChatGPTDataSource.delete({});
		await QuestionDataSource.delete({});
		await userDataSource.delete({});
	});

	it('should create a chatgpt reply', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);
		const newChatGptReply = chatGptReply();
		newChatGptReply.questionId = createdQuestion.id;

		const response = await ChatGptRepository.createChaptGptReply(
			newChatGptReply,
		);
		expect(response).to.be.an('object');
		expect(response).to.have.property('id');
		expect(response)
			.to.have.property('questionId')
			.to.equal(createdQuestion.id);
		expect(response).to.have.property('jsonAnswer');
	});

	it('should get chatgpt reply by question id', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		const createdQuestion = await createQuestion(question);
		const newChatGptReply = chatGptReply();
		newChatGptReply.questionId = createdQuestion.id;
		await createChatGptReply(newChatGptReply);

		const response = await ChatGptRepository.getChatGptReply(
			createdQuestion.id,
		);
		expect(response).to.be.an('object');
		expect(response).to.have.property('id');
		expect(response)
			.to.have.property('questionId')
			.to.equal(createdQuestion.id);
		expect(response).to.have.property('jsonAnswer');
	});
});
