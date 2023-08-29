import app from '../../../src/index';
import {expect} from 'chai';
import {agent as request} from 'supertest';
import {afterEach, after, before} from 'mocha';
import {HttpCodes} from '../../../src/util/HttpCodes';
import dataSource, {userDataSource} from '../../../src/domains/repo';
import env from '../../../src/config/env';
import {newUser, createUser} from '../../mocks';
import UserRepository from '../../../src/Repositories/UserRepository';

const base_url = '/api/v1';

describe('User endpoints', () => {
	before(async () => {
		await dataSource.initialize();
	});
	afterEach(async () => {
		await userDataSource.delete({});
	});
	after(async () => {
		await dataSource.destroy();
	});

	it('should register a user', async () => {
		const user = newUser();

		const response = await request(app)
			.post(base_url + '/users')
			.send({...user})
			.set('apiKey', env.API_KEY)
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include({
			success: true,
			statusCode: HttpCodes.OK,
			message: 'User login/signup successful',
		});
		expect(response.body.data).to.have.property('id');
		expect(response.body.data)
			.to.have.property('pubkey')
			.to.equal(user.pubkey.toLowerCase());
		expect(response.body.data)
			.to.have.property('email')
			.to.equal(user.email.toLowerCase());
		expect(response.body.data).to.have.property('role').to.equal(user.role);
		expect(response.body.data)
			.to.have.property('btcBalance')
			.to.equal(Number(user.btcBalance) + 1000);
		expect(response.body.data).to.have.property('fcmToken');
		expect(response.body.data).to.have.property('createdAt');
		expect(response.body.data).to.have.property('updatedAt');
		expect(response.body.data)
			.to.have.property('promotionBtcBalance')
			.to.equal(Number(1000).toString());
	});

	it('should not add promotional btc balance if user already exists', async () => {
		const user = newUser();
		await createUser(user);

		const response = await request(app)
			.post(base_url + '/users')
			.send({...user})
			.set('apiKey', env.API_KEY)
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include({
			success: true,
			statusCode: HttpCodes.OK,
			message: 'User login/signup successful',
		});
		expect(response.body.data)
			.to.have.property('pubkey')
			.to.equal(user.pubkey.toLowerCase());
		expect(response.body.data)
			.to.have.property('email')
			.to.equal(user.email.toLowerCase());
		expect(response.body.data).to.have.property('role').to.equal(user.role);
		expect(response.body.data)
			.to.have.property('btcBalance')
			.to.equal(Number(user.btcBalance).toString());
		expect(response.body.data)
			.to.have.property('promotionBtcBalance')
			.to.equal(Number(0).toString());
	});

	it('should return user details', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		await createUser(user);
		const response = await request(app).get(`${base_url}/users/${user.pubkey}`);
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include({
			success: true,
			statusCode: HttpCodes.OK,
			message: 'Successfully retrieved user details',
		});
		expect(response.body.data).to.have.property('id');
		expect(response.body.data).to.have.property('pubkey').to.equal(user.pubkey);
		expect(response.body.data).to.have.property('email').to.equal(user.email);
		expect(response.body.data).to.have.property('role').to.equal(user.role);
		expect(response.body.data).to.have.property('btcBalance');
		expect(response.body.data).to.have.property('fcmToken');
		expect(response.body.data).to.have.property('createdAt');
		expect(response.body.data).to.have.property('updatedAt');
	});

	it('should update user fcm token', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		await createUser(user);
		const response = await request(app)
			.patch(`${base_url}/users/fcmtoken/update`)
			.send({fcmToken: 'testtoken'})
			.set('apiKey', env.API_KEY)
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body.data).to.have.property('id');
		expect(response.body.data).to.have.property('pubkey').to.equal(user.pubkey);
		expect(response.body.data).to.have.property('email').to.equal(user.email);
		expect(response.body.data).to.have.property('role').to.equal(user.role);
		expect(response.body.data).to.have.property('btcBalance');
		expect(response.body.data)
			.to.have.property('fcmToken')
			.to.equal('testtoken');
	});
	it('should delete user account', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		const response = await request(app)
			.delete(`${base_url}/users/${createdUser.id}`)
			.set('apiKey', env.API_KEY)
			.set('Accept', 'application/json');
		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include({
			success: true,
			statusCode: HttpCodes.OK,
			message: 'Successfully deleted user account',
		});
	});
	it('should restore user account with updated information', async () => {
		const user = newUser();
		user.email = 'testemail@heartbit.io';
		const createdUser = await createUser(user);
		await UserRepository.deleteUserAccount(createdUser.id);
		const response = await request(app)
			.post(base_url + '/users')
			.send({...user})
			.set('apiKey', env.API_KEY)
			.set('Accept', 'application/json');

		expect(response.status).to.equal(HttpCodes.OK);
		expect(response.body).to.include({
			success: true,
			statusCode: HttpCodes.OK,
			message: 'User login/signup successful',
		});
		expect(response.body.data).to.have.property('id');
		expect(response.body.data)
			.to.have.property('pubkey')
			.to.equal(user.pubkey.toLowerCase());
		expect(response.body.data)
			.to.have.property('email')
			.to.equal(user.email.toLowerCase());
		expect(response.body.data).to.have.property('role').to.equal(user.role);
		expect(response.body.data).to.have.property('createdAt');
		expect(response.body.data).to.have.property('updatedAt');
		expect(response.body.data).to.have.property('deletedAt').to.equal(null);
	});
});
