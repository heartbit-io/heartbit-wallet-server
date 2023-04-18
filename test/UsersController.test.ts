import app from '../src/index';
import {expect} from 'chai';
import {agent as request} from 'supertest';
import {HttpCodes} from '../src/util/HttpCodes';
import {UserInstance, UserAttributes} from '../src/models/UserModel';
import {faker} from '@faker-js/faker';

const base_url = '/api/v1';

describe('User endpoints', () => {
	const newUser = () => {
		return {
			pubkey: faker.finance.bitcoinAddress() + new Date().getTime().toString(),
			role: faker.helpers.arrayElement(['user', 'admin', 'doctor']),
			btc_balance: Number(faker.finance.amount()),
		};
	};

	const createUser = async (user: UserAttributes) => {
		const result = await request(app)
			.post(base_url + '/users')
			.send({...user})
			.set('Accept', 'application/json');
		return result;
	};

	describe('create user', () => {
		afterEach(async () => {
			await UserInstance.destroy({where: {}, truncate: true});
		});

		it('should register a user', async () => {
			const user = newUser();
			const response = await createUser(user);
			expect(response.status).to.equal(HttpCodes.CREATED);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.CREATED,
				message: 'User created successfully',
			});
			expect(response.body.data).to.contain({
				...user,
			});
		});

		it('should return validator error if public key is not unique', async () => {
			const user = newUser();
			await createUser(user);
			const response = await createUser(user);
			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should return validator error role is not user or admin or doctor', async () => {
			const user = newUser();
			const request_body = {...user, role: 'none'};
			const response = await createUser(request_body);

			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});
	});
	describe('get user details', () => {
		it('should return user details', async () => {
			const user = newUser();
			await createUser(user);

			const response = await request(app).get(
				`${base_url}/users/${user.pubkey}`,
			);
			expect(response.status).to.equal(HttpCodes.OK);
			expect(response.body).to.include({
				success: true,
				statusCode: HttpCodes.OK,
				message: 'Successfully retrieved user details',
			});
			expect(response.body.data).to.include({...user});
		});

		it('should not return data if user is not found', async () => {
			const user = newUser();

			const response = await request(app).get(
				`${base_url}/users/${user.pubkey}`,
			);
			expect(response.status).to.equal(HttpCodes.NOT_FOUND);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.NOT_FOUND,
				message: 'User was not found',
				data: null,
			});
		});
	});
});
