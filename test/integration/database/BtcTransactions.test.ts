import {faker} from '@faker-js/faker';
import {expect} from 'chai';
import app from '../../../src/index';
import BtcTransactionsRepository from '../../../src/Repositories/BtcTransactionsRepository';
import {BtcTransactionDataSource} from '../../../src/domains/repo';
import {BtcTransaction} from '../../../src/domains/entities/BtcTransaction';

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
            type: faker.helpers.arrayElement(['deposit', 'withdraw', 'sign_up_bonus', 'bounty_earned', 'bounty_pledged', 'bounty_refunded']),
            createdAt: faker.date.past(),
            updatedAt: faker.date.past(),
            deletedAt: null,
        };
    }

    const createBtcTransaction = async (btcTransaction: BtcTransaction) => { 
        const result = await BtcTransactionsRepository.createTransaction(btcTransaction);
        return result;
    }

    it('should create a btc transaction', async () => { 
        const btcTransaction = newBtcTransaction();
        const result = await createBtcTransaction(btcTransaction);
        expect(result).to.be.an('object');
        expect(result).to.have.property('id');
        expect(result).to.have.property('txid');
        expect(result).to.have.property('amount');
        expect(result).to.have.property('status');
        expect(result).to.have.property('user_id');
        expect(result).to.have.property('user_email');
    }
});
