import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import BtcTransactionsRepository from '../../../src/Repositories/BtcTransactionsRepository';
import dataSource, {BtcTransactionDataSource} from '../../../src/domains/repo';
import {createBtcTransaction, newBtcTransaction} from '../mocks';

describe('BtcTransactions Repository queries', () => {
	before(async () => {
		await dataSource.initialize();
	});
	after(async () => {
		dataSource.destroy();
	});
	afterEach(async () => {
		await BtcTransactionDataSource.delete({});
	});

	it('should create a btc transaction', async () => {
		const btcTransaction = newBtcTransaction();
		const result = await createBtcTransaction(btcTransaction);
		expect(result).to.be.an('object');
		expect(result).to.have.property('id');
		expect(result).to.have.property('amount');
		expect(result).to.have.property('fee');
		expect(result).to.have.property('fromUserPubkey');
		expect(result).to.have.property('toUserPubkey');
		expect(result).to.have.property('type');
		expect(result).to.have.property('createdAt');
		expect(result).to.have.property('updatedAt');
		expect(result.amount).to.equal(btcTransaction.amount);
		expect(result.fee).to.equal(btcTransaction.fee);
		expect(result.fromUserPubkey).to.equal(btcTransaction.fromUserPubkey);
		expect(result.toUserPubkey).to.equal(btcTransaction.toUserPubkey);
		expect(result.type).to.equal(btcTransaction.type);
	});

	it('should get user transactions', async () => {
		const btcTransaction = newBtcTransaction();
		const result = await createBtcTransaction(btcTransaction);
		const userTransactions =
			await BtcTransactionsRepository.getUserTransactions(
				btcTransaction.fromUserPubkey,
				10,
				0,
			);
		expect(userTransactions).to.be.an('array');
		expect(userTransactions).to.have.lengthOf(1);
		expect(userTransactions[0]).to.have.property('id');
		expect(userTransactions[0]).to.have.property('amount');
		expect(userTransactions[0]).to.have.property('fee');
		expect(userTransactions[0]).to.have.property('fromUserPubkey');
		expect(userTransactions[0]).to.have.property('toUserPubkey');
		expect(userTransactions[0]).to.have.property('type');
		expect(userTransactions[0]).to.have.property('createdAt');
		expect(userTransactions[0]).to.have.property('updatedAt');
		expect(Number(userTransactions[0].amount)).to.equal(btcTransaction.amount);
		expect(Number(userTransactions[0].fee)).to.equal(btcTransaction.fee);
		expect(userTransactions[0].fromUserPubkey).to.equal(
			btcTransaction.fromUserPubkey,
		);
		expect(userTransactions[0].toUserPubkey).to.equal(
			btcTransaction.toUserPubkey,
		);
		expect(userTransactions[0].type).to.equal(btcTransaction.type);
	});

	it('should get user transactions count', async () => {
		const btcTransaction = newBtcTransaction();
		const result = await createBtcTransaction(btcTransaction);
		const newTransactionData = newBtcTransaction();
		newTransactionData.fromUserPubkey = btcTransaction.fromUserPubkey;
		const newTransaction = await createBtcTransaction(newTransactionData);
		const userTransactionsCount =
			await BtcTransactionsRepository.getUserTransactionsCount(
				btcTransaction.fromUserPubkey,
			);
		expect(userTransactionsCount).to.be.an('number');
		expect(userTransactionsCount).to.equal(2);
	});
});
