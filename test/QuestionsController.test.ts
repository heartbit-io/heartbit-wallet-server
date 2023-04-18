import app from '../src/index';
import {expect} from 'chai';
import {agent as request} from 'supertest';
import {HttpCodes} from '../src/util/HttpCodes';
import {faker} from '@faker-js/faker';
import {QuestionInstance, QuestionStatus} from '../src/models/QuestionModel';
import {UserInstance} from '../src/models/UserModel';

const base_url = '/api/v1';

describe('Questions endpoints', () => {
	afterEach(async () => {
		await UserInstance.destroy({where: {}, truncate: true});
		await QuestionInstance.destroy({where: {}, truncate: true});
	});

	const newUser = () => {
		return {
			pubkey: faker.finance.bitcoinAddress() + new Date().getTime().toString(),
			role: faker.helpers.arrayElement(['user', 'admin', 'doctor']),
			btc_balance: Number(faker.finance.amount()),
		};
	};

	const newQuestion = () => {
		return {
			content: faker.lorem.sentences(),
			bounty_amount: Number(faker.finance.amount()),
			user_pubkey:
				faker.finance.bitcoinAddress() + new Date().getTime().toString(),
		};
	};

	describe('create question', () => {
		it('should create a question', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');

			const question = newQuestion();
			const user_pubkey = user.pubkey;
			const bounty_amount = user.btc_balance / 2;
			const response = await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					bounty_amount,
				})
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.CREATED);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.CREATED,
				message: 'Question posted successfully',
			});
			expect(response.body.data).to.contain({
				...question,
				user_pubkey,
				bounty_amount,
			});
		});

		it('should return validator error if user public key is not registered', async () => {
			const question = newQuestion();
			const response = await request(app)
				.post(base_url + '/users')
				.send({...question})
				.set('Accept', 'application/json');
			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should return validator error role if bounty amount is higher than user btc balance', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');

			const question = newQuestion();
			const user_pubkey = user.pubkey;
			const bounty_amount = user.btc_balance + 2;
			const response = await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					bounty_amount,
				})
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should return validator error role if user public key is not supplied', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');

			const question = newQuestion();
			const user_pubkey = null;
			const bounty_amount = user.btc_balance / 2;
			const response = await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					bounty_amount,
				})
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should return validator error role if question content is not supplied', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');

			const question = newQuestion();
			const user_pubkey = user.pubkey;
			const content = null;
			const bounty_amount = user.btc_balance / 2;
			const response = await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					content,
					bounty_amount,
				})
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should return validator error role if bounty amount is not supplied', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');

			const question = newQuestion();
			const user_pubkey = user.pubkey;
			const bounty_amount = null;
			const response = await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					bounty_amount,
				})
				.set('Accept', 'application/json');

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});
	});
	describe('get all questions', () => {
		it('should return all questions', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');
			const question = newQuestion();
			const user_pubkey = user.pubkey;
			const bounty_amount = user.btc_balance / 2;
			await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					bounty_amount,
				})
				.set('Accept', 'application/json');

			const response = await request(app).get(`${base_url}/questions`);
			expect(response.status).to.equal(HttpCodes.OK);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Successfully retrieved all questions',
			});
			expect(response.body.data).to.be.an('array');
		});

		it('should return all open questions', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');
			const question = newQuestion();
			const user_pubkey = user.pubkey;
			const status = QuestionStatus.Open;
			const bounty_amount = user.btc_balance / 2;
			await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					status,
					bounty_amount,
				})
				.set('Accept', 'application/json');
			const response = await request(app).get(`${base_url}/questions/open`);
			expect(response.status).to.equal(HttpCodes.OK);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Successfully retrieved all open questions',
			});
			expect(response.body.data).to.be.an('array');
			expect(response.body.data[0].status).to.equal(QuestionStatus.Open);
		});
	});
	describe('it should get a question by id', () => {
		it('should return a question by id', async () => {
			const user = newUser();
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');
			const question = newQuestion();
			const user_pubkey = user.pubkey;
			const status = QuestionStatus.Open;
			const bounty_amount = user.btc_balance / 2;
			const create_question = await request(app)
				.post(base_url + '/questions')
				.send({
					...question,
					user_pubkey,
					status,
					bounty_amount,
				})
				.set('Accept', 'application/json');

			const response = await request(app).get(
				`${base_url}/questions/${create_question.body.data.id}`,
			);
			expect(response.status).to.equal(HttpCodes.OK);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Successfully retrieved question details',
			});
			expect(response.body.data).to.include({
				...question,
				user_pubkey,
				status,
				bounty_amount,
			});
			expect(response.body.data)
				.to.have.property('replies')
				.that.is.an('array');
        });
        
    });
    
    describe('it should delete a question by id', () => { 
        it('should delete a question by id', async () => {
            const user = newUser();
            await request(app)
                .post(base_url + '/users')
                .send({...user})
                .set('Accept', 'application/json');
            const question = newQuestion();
            const user_pubkey = user.pubkey;
            const status = QuestionStatus.Open;
            const bounty_amount = user.btc_balance / 2;
            const create_question = await request(app)
                .post(base_url + '/questions')
                .send({
                    ...question,
                    user_pubkey,
                    status,
                    bounty_amount,
                })
                .set('Accept', 'application/json');
    
            const response = await request(app).delete(
                `${base_url}/questions/${create_question.body.data.id}`,
            ).send({
                user_pubkey
            }).set('Accept', 'application/json');
            expect(response.status).to.equal(HttpCodes.OK);
            expect(response.body).to.include({
                success: true,
                statusCode: HttpCodes.OK,
                message: 'Question deleted successfully',
            });
        });
    });

});
