import {faker} from '@faker-js/faker';
import {expect} from 'chai';
import BtcTransactionsRepository from '../../../src/Repositories/BtcTransactionsRepository';
import {BtcTransactionDataSource} from '../../../src/domains/repo';
import {BtcTransaction} from '../../../src/domains/entities/BtcTransaction';
import {TxTypes} from '../../../src/util/enums';
import dataSource from '../../../src/domains/repo';
import {afterEach} from 'mocha';

describe('BtcTransactions queries', () => {
	afterEach(async () => {
		await BtcTransactionDataSource.delete({});
	});

	const newBtcTransaction = () => {
		return {
			id: faker.number.int({min: 1, max: 50}),
			amount: Number(faker.finance.amount()),
			fromUserPubkey: faker.string.alphanumeric(32),
			toUserPubkey: faker.string.alphanumeric(32),
			fee: Number(faker.finance.amount()),
			type: faker.helpers.arrayElement(Object.values(TxTypes)),
			createdAt: faker.date.past(),
			updatedAt: faker.date.past(),
			deletedAt: null,
		};
	};

	const createBtcTransaction = async (btcTransaction: BtcTransaction) => {
		const result = await BtcTransactionsRepository.createTransaction(
			btcTransaction,
		);
		return result;
	};

	it('should create a btc transaction', async () => {
		await dataSource.initialize();

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
});
