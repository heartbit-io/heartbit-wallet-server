import {faker} from '@faker-js/faker';
import {expect} from 'chai';
import dataSource, {userDataSource} from '../../../src/domains/repo';
import UserRepository from '../../../src/Repositories/UserRepository';
import {afterEach, after} from 'mocha';

describe('User Repository queries', () => {
	afterEach(async () => {
		await userDataSource.delete({});
	});

	const newUser = () => {
		return {
			id: faker.number.int({min: 1, max: 50}),
			email: faker.internet.email(),
			pubkey: faker.string.alphanumeric(32),
			btcBalance: Number(faker.finance.amount()),
			fcmToken: faker.string.alphanumeric(32),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			deletedAt: null,
		};
	};

	const createUser = async (user: any) => {
		return await UserRepository.createUser(user);
	};

	it('should create a user', async () => {
		await dataSource.initialize();

		const user = newUser();
		const result = await createUser(user);
		expect(result).to.be.an('object');
		expect(result).to.have.property('id');
		expect(result).to.have.property('email');
		expect(result).to.have.property('pubkey');
		expect(result).to.have.property('btcBalance');
		expect(result).to.have.property('fcmToken');
	});

	it('should get user by pubkey', async () => {
		const user = newUser();
		await createUser(user);
		const userByPubkey = await UserRepository.getUserDetailsByPubkey(
			user.pubkey,
		);
		expect(userByPubkey).to.be.an('object');
		expect(userByPubkey).to.have.property('id');
		expect(userByPubkey).to.have.property('email').to.equal(user.email);
		expect(userByPubkey).to.have.property('pubkey').to.equal(user.pubkey);
		expect(userByPubkey)
			.to.have.property('btcBalance')
			.to.equal(user.btcBalance.toString());
		expect(userByPubkey).to.have.property('fcmToken').to.equal(user.fcmToken);
	});

	it('should get user by email', async () => {
		const user = newUser();
		await createUser(user);
		const userByEmail = await UserRepository.getUserDetailsByEmail(user.email);
		expect(userByEmail).to.be.an('object');
		expect(userByEmail).to.have.property('id');
		expect(userByEmail).to.have.property('email').to.equal(user.email);
		expect(userByEmail).to.have.property('pubkey').to.equal(user.pubkey);
		expect(userByEmail)
			.to.have.property('btcBalance')
			.to.equal(user.btcBalance.toString());
		expect(userByEmail).to.have.property('fcmToken').to.equal(user.fcmToken);
	});

	it('should get user by id', async () => {
		const user = newUser();
		const result = await createUser(user);
		const userById = await UserRepository.getUserDetailsById(result.id);
		expect(userById).to.be.an('object');
		expect(userById).to.have.property('id').to.equal(result.id);
		expect(userById).to.have.property('email').to.equal(user.email);
		expect(userById).to.have.property('pubkey').to.equal(user.pubkey);
		expect(userById)
			.to.have.property('btcBalance')
			.to.equal(user.btcBalance.toString());
		expect(userById).to.have.property('fcmToken').to.equal(user.fcmToken);
	});

	it('should get user balance', async () => {
		const user = newUser();
		const result = await createUser(user);
		const userBalance = await UserRepository.getUserBalance(result.id);
		expect(userBalance).to.be.an('object');
		expect(userBalance)
			.to.have.property('btcBalance')
			.to.equal(user.btcBalance.toString());
	});

	it('should update user balance', async () => {
		const user = newUser();
		const result = await createUser(user);
		const newBalance = 100;
		const updatedUserBalance = await UserRepository.updateUserBtcBalance(
			newBalance,
			result.id,
		);
		const userBalance = await UserRepository.getUserBalance(result.id);
		expect(updatedUserBalance).to.be.an('object');
		expect(userBalance)
			.to.have.property('btcBalance')
			.to.equal(newBalance.toString());
	});

	it('should get user fcm token', async () => {
		const user = newUser();
		const result = await createUser(user);
		const userFcmToken = await UserRepository.getUserFcmToken(result.id);
		expect(userFcmToken?.fcmToken).to.equal(result.fcmToken);
	});

	after(async () => {
		dataSource.destroy();
	});
});
