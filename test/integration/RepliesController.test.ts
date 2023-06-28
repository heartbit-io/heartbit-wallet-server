import {agent as request} from 'supertest';
import {expect} from 'chai';
import {faker} from '@faker-js/faker';
import {HttpCodes} from '../../src/util/HttpCodes';
import app from '../../src/index';
import {User, UserAttributes} from '../../src/domains/entities/User';
import {
	Question,
	QuestionAttributes,
} from '../../src/domains/entities/Question';
import {RepliesAttributes} from '../../src/domains/entities/Reply';
import {newQuestion} from './QuestionsController.test';
import {newUser} from './UsersController.test';
import {ReplyStatus} from '../../src/util/enums';

const base_url = '/api/v1';

describe('Replies endpoints', () => {
	afterEach(async () => {
		// await User.destroy({where: {}, truncate: true});
		// await Question.destroy({where: {}, truncate: true});
		// await Reply.destroy({where: {}, truncate: true});
	});

	const createUser = async (user: UserAttributes) => {
		const result = await request(app)
			.post(base_url + '/users')
			.send({...user})
			.set('Accept', 'application/json');
		return result;
	};

	const createQuestion = async (question: QuestionAttributes) => {
		return await request(app)
			.post(base_url + '/questions')
			.send({
				...question,
			})
			.set('Accept', 'application/json');
	};

	const createReply = async (reply: RepliesAttributes) => {
		return await request(app)
			.post(base_url + '/replies')
			.send({
				...reply,
			})
			.set('Accept', 'application/json');
	};

	describe('post creating a reply', () => {
		it('should create a reply', async () => {
			const user = newUser();
			await createUser(user);
			const secondUser = newUser();
			const secondUserResponse = await createUser(secondUser);

			const question = newQuestion();

			const question_body = {
				...question,
				user_email: user.email,
				bounty_amount: user.btcBalance / 2,
			};
			const create_question = await createQuestion(question_body);

			const replyRequest = {
				questionId: create_question.body.data.id,
				userId: secondUserResponse.body.data.id,
				content: faker.lorem.paragraph(),
				title: faker.lorem.sentence(),
				status: faker.helpers.arrayElement(Object.values(ReplyStatus)),
				majorComplaint: faker.lorem.sentence(),
				medicalHistory: faker.lorem.sentence(),
				currentMedications: faker.lorem.sentence(),
				assessment: faker.lorem.sentence(),
				plan: faker.lorem.sentence(),
				triage: faker.lorem.sentence(),
			};

			const response = await createReply(replyRequest);

			expect(response.status).to.equal(HttpCodes.CREATED);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.CREATED,
				message: 'Reply created successfully',
			});
			expect(response.body.data).to.include({
				question_id: create_question.body.data.id,
				user_email: secondUser.email,
			});
		});

		it('should not create a reply if the question does not exist', async () => {
			const user = newUser();
			await createUser(user);
			const second_user = newUser();
			await createUser(second_user);

			const reply_request = {
				user_email: second_user.email,
				content: faker.lorem.paragraph(),
			};

			const response = await request(app)
				.post(base_url + '/replies')
				.send(reply_request)
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should not create a reply if the user does not exist', async () => {
			const user = newUser();
			await createUser(user);

			const question = newQuestion();
			await createQuestion(question);

			const reply_request = {
				user_email: null,
				content: faker.lorem.paragraph(),
			};

			const response = await request(app)
				.post(base_url + '/replies')
				.send(reply_request)
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should not create a reply if content is not supplied', async () => {
			const user = newUser();
			await createUser(user);
			const second_user = newUser();
			await createUser(second_user);

			const question = newQuestion();
			const question_body = {
				...question,
				user_email: user.email,
				bounty_amount: user.btcBalance / 2,
			};
			const create_question = await createQuestion(question_body);

			const reply_request = {
				question_id: create_question.body.data.id,
				user_email: second_user.email,
			};

			const response = await request(app)
				.post(base_url + '/replies')
				.send(reply_request)
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});
	});
});
