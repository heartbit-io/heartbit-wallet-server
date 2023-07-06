import app from '../../../src/index';
import {expect} from 'chai';
import {agent as request} from 'supertest';
import {afterEach, after, before} from 'mocha';
import {HttpCodes} from '../../../src/util/HttpCodes';
import dataSource, {userDataSource} from '../../../src/domains/repo';
import env from '../../../src/config/env';
import {newUser, createUser} from '../mocks';

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
			.to.equal(user.btcBalance.toString());
		expect(response.body.data).to.have.property('fcmToken');
		expect(response.body.data).to.have.property('createdAt');
		expect(response.body.data).to.have.property('updatedAt');
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
		expect(response.body.data)
			.to.have.property('btcBalance')
			.to.equal(user.btcBalance.toString());
		expect(response.body.data).to.have.property('fcmToken');
		expect(response.body.data).to.have.property('createdAt');
		expect(response.body.data).to.have.property('updatedAt');
	});
});
