import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import dataSource, {
	ChatGPTDataSource,
	QuestionDataSource,
	userDataSource,
} from '../../../src/domains/repo';
import QuestionRepository from '../../../src/Repositories/QuestionRepository';
import {QuestionStatus} from '../../../src/util/enums';
import {
	newQuestion,
	createQuestion,
	createUser,
	newUser,
	chatGptReply,
	createChatGptReply,
} from '../../mocks';

describe('Question Repository queries', () => {
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

	it('should create a question', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		const result = await createQuestion(question);
		expect(result).to.be.an('object');
		expect(result).to.have.property('id');
		expect(result).to.have.property('content');
		expect(result).to.have.property('rawContentLanguage');
		expect(result).to.have.property('rawContent');
		expect(result).to.have.property('userId');
		expect(result).to.have.property('bountyAmount');
		expect(result).to.have.property('status');
		expect(result).to.have.property('createdAt');
		expect(result).to.have.property('updatedAt');
	});

	it('should get all questions', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		await createQuestion(question2);

		const allQuestions = await QuestionRepository.getAll(
			createdUser.id,
			10,
			0,
			'DESC',
		);
		expect(allQuestions).to.be.an('array');
		expect(allQuestions).to.have.lengthOf(2);
		expect(allQuestions[0]).to.have.property('id');
		expect(allQuestions[0]).to.have.property('content');
		expect(allQuestions[0]).to.have.property('rawContentLanguage');
		expect(allQuestions[0]).to.have.property('rawContent');
		expect(allQuestions[0]).to.have.property('userId');
		expect(allQuestions[0]).to.have.property('bountyAmount');
		expect(allQuestions[0]).to.have.property('status');
		expect(allQuestions[0]).to.have.property('createdAt');
		expect(allQuestions[0]).to.have.property('updatedAt');
	});

	it('should get a question by id', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		const result = await createQuestion(question2);
		const questionById = await QuestionRepository.getQuestion(result.id);
		expect(questionById).to.be.an('object');
		expect(questionById).to.have.property('id');
		expect(questionById).to.have.property('content');
		expect(questionById).to.have.property('rawContentLanguage');
		expect(questionById).to.have.property('rawContent');
		expect(questionById).to.have.property('userId');
		expect(questionById).to.have.property('bountyAmount');
		expect(questionById).to.have.property('status');
		expect(questionById).to.have.property('createdAt');
		expect(questionById).to.have.property('updatedAt');
	});

	it('should update a question status', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		const result = await createQuestion(question);

		const updatedQuestion = await QuestionRepository.updateStatus(
			QuestionStatus.CLOSED,
			result.id,
		);
		const questionById = await QuestionRepository.getQuestion(result.id);

		expect(questionById).to.be.an('object');
		expect(questionById).to.have.property('id');
		expect(questionById).to.have.property('content');
		expect(questionById).to.have.property('rawContentLanguage');
		expect(questionById).to.have.property('rawContent');
		expect(questionById).to.have.property('userId');
		expect(questionById).to.have.property('bountyAmount');
		expect(questionById)
			.to.have.property('status')
			.to.equal(QuestionStatus.CLOSED);
		expect(questionById).to.have.property('createdAt');
		expect(questionById).to.have.property('updatedAt');
	});

	it('should soft-delete a question', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		const result = await createQuestion(question);
		await QuestionRepository.deleteQuestion(result.id);
		const deletedQuestion = await QuestionDataSource.findOne({
			where: {id: result.id},
			withDeleted: true,
		});
		expect(deletedQuestion).to.be.an('object');
		expect(deletedQuestion).to.have.property('id');
		expect(deletedQuestion).to.have.property('content');
		expect(deletedQuestion).to.have.property('rawContentLanguage');
		expect(deletedQuestion).to.have.property('rawContent');
		expect(deletedQuestion).to.have.property('userId');
		expect(deletedQuestion).to.have.property('bountyAmount');
		expect(deletedQuestion).to.have.property('createdAt');
		expect(deletedQuestion).to.have.property('deletedAt').to.not.equal(null);
	});

	it('should get all questions by user id', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		await createQuestion(question2);

		const allQuestions = await QuestionRepository.getUserQuestions(
			createdUser.id,
		);
		expect(allQuestions).to.be.an('array');
		expect(allQuestions).to.have.lengthOf(2);
		expect(allQuestions[0]).to.have.property('id');
		expect(allQuestions[0]).to.have.property('content');
		expect(allQuestions[0]).to.have.property('rawContentLanguage');
		expect(allQuestions[0]).to.have.property('rawContent');
		expect(allQuestions[0]).to.have.property('userId');
		expect(allQuestions[0]).to.have.property('bountyAmount');
		expect(allQuestions[0]).to.have.property('status');
		expect(allQuestions[0]).to.have.property('createdAt');
		expect(allQuestions[0]).to.have.property('updatedAt');
	});

	it('should get user open questions', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		question.status = QuestionStatus.OPEN;
		const firstQuestion = await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		question2.status = QuestionStatus.CLOSED;
		await createQuestion(question2);

		const allQuestions = await QuestionRepository.getUserOpenQuestion(
			firstQuestion.id,
			createdUser.id,
		);
		expect(allQuestions).to.be.an('object');
		expect(allQuestions).to.have.property('id');
		expect(allQuestions).to.have.property('content');
		expect(allQuestions).to.have.property('rawContentLanguage');
		expect(allQuestions).to.have.property('rawContent');
		expect(allQuestions).to.have.property('userId');
		expect(allQuestions).to.have.property('bountyAmount');
		expect(allQuestions).to.have.property('status');
		expect(allQuestions).to.have.property('createdAt');
		expect(allQuestions).to.have.property('updatedAt');
	});

	it('should count user questions', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		await createQuestion(question2);

		const count = await QuestionRepository.countUserQuestions(createdUser.id);
		expect(count).to.be.a('number');
		expect(count).to.equal(2);
	});

	it('should get questions using their ids', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		const firstQuestion = await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		const secondQuestion = await createQuestion(question2);

		const questions =
			await QuestionRepository.getDoctorAnswerdQuestionsByQuestionIds([
				firstQuestion.id,
				secondQuestion.id,
			]);
		expect(questions).to.be.an('array');
		expect(questions).to.have.lengthOf(2);
		expect(questions[0]).to.have.property('id');
		expect(questions[0]).to.have.property('content');
		expect(questions[0]).to.have.property('rawContentLanguage');
		expect(questions[0]).to.have.property('rawContent');
		expect(questions[0]).to.have.property('userId');
		expect(questions[0]).to.have.property('bountyAmount');
		expect(questions[0]).to.have.property('status');
		expect(questions[0]).to.have.property('createdAt');
		expect(questions[0]).to.have.property('updatedAt');
	});

	it('should get open questions ordered by their bounty', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const questionData = newQuestion();
		questionData.userId = createdUser.id;
		questionData.status = QuestionStatus.OPEN;
		questionData.bountyAmount = 100;
		const firstQuestion = await createQuestion(questionData);
		const firstChatGptReply = chatGptReply();
		firstChatGptReply.questionId = firstQuestion.id;
		await createChatGptReply(firstChatGptReply);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		question2.status = QuestionStatus.OPEN;
		question2.bountyAmount = 200;
		const secondQuestion = await createQuestion(question2);
		const newChatGptReply = chatGptReply();
		newChatGptReply.questionId = secondQuestion.id;
		await createChatGptReply(newChatGptReply);

		const index = 0;

		const question = await QuestionRepository.getOpenQuestionsOrderByBounty(
			index,
			Number(createdUser.id) + 1,
		);
		const secondSelectedQuestion =
			await QuestionRepository.getOpenQuestionsOrderByBounty(
				1,
				Number(createdUser.id) + 1,
			);
		expect(question[0]).to.be.an('object');
		expect(question[0]).to.have.property('id');
		expect(question[0]).to.have.property('content');
		expect(question[0]).to.have.property('rawContentLanguage');
		expect(question[0]).to.have.property('rawContent');
		expect(question[0]).to.have.property('userId');
		expect(question[0]).to.have.property('bountyAmount');
		expect(question[0]).to.have.property('status');
		expect(question[0]).to.have.property('createdAt');
		expect(question[0]).to.have.property('updatedAt');
		if (!question) throw new Error('question is null');
		expect(Number(question[0].bountyAmount)).to.equal(200);

		expect(secondSelectedQuestion[0]).to.be.an('object');
		expect(Number(secondSelectedQuestion[0].bountyAmount)).to.equal(100);
	});

	it('should get sum of user open bounty questions', async () => {
		const user = newUser();
		const createdUser = await createUser(user);
		const question = newQuestion();
		question.userId = createdUser.id;
		question.status = QuestionStatus.OPEN;
		question.bountyAmount = 100;
		await createQuestion(question);

		const question2 = newQuestion();
		question2.userId = createdUser.id;
		question2.status = QuestionStatus.OPEN;
		question2.bountyAmount = 200;
		await createQuestion(question2);

		const sum = await QuestionRepository.sumUserOpenBountyAmount(
			createdUser.id,
		);
		expect(sum).to.be.a('object');
		expect(Number(sum.totalBounty)).to.equal(300);
	});
});
