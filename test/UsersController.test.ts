import app from '../src/index';
import {expect} from 'chai';
import {agent as request} from 'supertest';
import {HttpCodes} from '../src/util/HttpCodes';
import {UserInstance} from '../src/models/UserModel';
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

	describe('create user', () => {
		afterEach(async () => {
			await UserInstance.destroy({where: {}, truncate: true});
		});

		it('should register a user', async () => {
			const user = newUser();
			const response = await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');
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
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');

			const response = await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');
			expect(response.status).to.equal(HttpCodes.BAD_REQUEST);
			expect(response.body).to.include({
				success: false,
				statusCode: HttpCodes.BAD_REQUEST,
			});
		});

		it('should return validator error role is not user or admin or doctor', async () => {
			const user = newUser();
			const response = await request(app)
				.post(base_url + '/users')
				.send({...user, role: 'none'})
				.set('Accept', 'application/json');

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
			await request(app)
				.post(base_url + '/users')
				.send({...user})
				.set('Accept', 'application/json');

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
                data: null
			});
		});
    });
});
