import LNDUtil from '../util/LNDUtil';
import {lnd, lud, cache} from '..';
import logger from '../util/logger';
import {PayResult} from 'lightning';
import dataSource from '../domains/repo';
import {User} from '../domains/entities/User';
import env from '../config/env';
import FBUtil from '../util/FBUtil';
import {BtcTransaction} from '../domains/entities/BtcTransaction';
import {TxTypes} from '../util/enums';
import {CustomError} from '../util/CustomError';
import {HttpCodes} from '../util/HttpCodes';
import UserRepository from '../Repositories/UserRepository';
import WithdrawalInfoDto from '../dto/WithdrawalInfoDto';

class PaymentsService {
	async getPaymentRequest(email: string, amount: number): Promise<string> {
		try {
			const paymentRequest = await LNDUtil.requestPayment(
				lnd,
				Number(amount),
				email,
			);
			return paymentRequest.request;
		} catch (error: any) {
			logger.error(error);
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getHoldingPaymentRequest(
		email: string,
		amount: number,
	): Promise<string> {
		try {
			const {invoice, secret} = await LNDUtil.requestHoldingPayment(
				lnd,
				Number(amount),
				email,
			);

			cache.set(invoice.request, secret);

			return invoice.request;
		} catch (error: any) {
			console.error(error);
			logger.error(error);
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getWithdrawalRequest(email: string, amount: number): Promise<string> {
		try {
			//check wheter amount is greater than 500k satoshi
			if (amount > 500000)
				throw new CustomError(
					HttpCodes.BAD_REQUEST,
					'Maximum withdrawable amount is 500k satoshis per request',
				);

			//check that user has enough balance
			const user = await UserRepository.getUserDetailsByEmail(email);

			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			if (user.btcBalance < Number(amount))
				throw new CustomError(
					HttpCodes.UNPROCESSED_CONTENT,
					'Insufficient balance',
				);

			const tag = 'withdrawRequest';
			const amountInMsat = Number(amount) * 1000;
			const params = {
				defaultDescription: email,
				minWithdrawable: 1000,
				maxWithdrawable: amountInMsat,
			};
			const options = {
				uses: 1,
			};

			const withdrawRequest = await lud.generateNewUrl(tag, params, options);

			if (
				!cache.set(
					withdrawRequest.secret,
					new WithdrawalInfoDto(
						tag,
						env.BASE_SERVER_DOMAIN + 'lnurl/withdrawals/payments',
						withdrawRequest.secret,
						params.defaultDescription,
						params.minWithdrawable,
						params.maxWithdrawable,
					),
				)
			)
				throw new CustomError(
					HttpCodes.INTERNAL_SERVER_ERROR,
					'Cache unavailable',
				);

			return withdrawRequest.encoded;
		} catch (error: any) {
			logger.error(error);
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async getWithdrawalInfo(secret: string): Promise<WithdrawalInfoDto> {
		try {
			const withdrawalInfo: WithdrawalInfoDto | undefined = cache.get(secret);
			if (withdrawalInfo === undefined)
				throw new CustomError(HttpCodes.BAD_REQUEST, 'Invalid q value');
			return withdrawalInfo;
		} catch (error: any) {
			logger.error(error);
			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		}
	}

	async payWithdrawalInvoice(secret: string, invoice: string): Promise<void> {
		const queryRunner = dataSource.createQueryRunner();
		await queryRunner.connect();
		await queryRunner.startTransaction('REPEATABLE READ');

		try {
			secret = secret as string;
			invoice = invoice as string;

			const withdrawalInfo: WithdrawalInfoDto | undefined = cache.get(secret);
			if (withdrawalInfo === undefined)
				throw new CustomError(HttpCodes.BAD_REQUEST, 'Invalid k1 value');

			const withdrawalSat = (withdrawalInfo.maxWithdrawable / 1000) as number;

			//check wheter amount is greater than 2 milion satoshi
			let accumulatedAmount: number | undefined = cache.get(
				withdrawalInfo.defaultDescription,
			);
			if (!accumulatedAmount) accumulatedAmount = 0;
			if (accumulatedAmount + withdrawalSat > 2000000)
				throw new CustomError(
					HttpCodes.SERVICE_UNAVAILABLE,
					'Daily withdrawable amount is capped',
				);

			const user = await queryRunner.manager
				.getRepository(User)
				.createQueryBuilder('user')
				.useTransaction(true)
				.setLock('pessimistic_write')
				.where('user.email = :email', {
					email: withdrawalInfo.defaultDescription as string,
				})
				.getOne();
			if (!user) throw new CustomError(HttpCodes.NOT_FOUND, 'User not found');

			if (user.btcBalance < withdrawalSat)
				throw new CustomError(
					HttpCodes.UNPROCESSED_CONTENT,
					'Insufficient balance',
				);

			const btcTx = await queryRunner.manager.insert(BtcTransaction, {
				amount: withdrawalSat,
				fromUserPubkey: withdrawalInfo.defaultDescription as string,
				toUserPubkey: withdrawalInfo.defaultDescription as string,
				fee: 0,
				type: TxTypes.WITHDRAW,
				createdAt: () => 'CURRENT_TIMESTAMP',
				updatedAt: () => 'CURRENT_TIMESTAMP',
			});

			await queryRunner.manager.update(User, user.id, {
				btcBalance: () => `btc_balance - ${withdrawalSat}`,
			});

			await queryRunner.commitTransaction();

			// error handling block for custom rollback
			try {
				const payment: PayResult = await LNDUtil.makePayment(lnd, invoice);
				if (!payment.is_confirmed)
					throw new CustomError(
						HttpCodes.UNPROCESSED_CONTENT,
						'payment not confirmed',
					);
			} catch (err) {
				logger.error(err);
				await queryRunner.startTransaction('REPEATABLE READ');
				/*
				If payment is not confirmed, rollback committed transaction
				As committed one cannot be rolled back automatically,
				Need to roll back manually
				*/

				// delete last btc transaction inserted
				await queryRunner.manager.delete(
					BtcTransaction,
					btcTx.identifiers[0].id,
				);

				// recover user balance
				await queryRunner.manager
					.getRepository(User)
					.createQueryBuilder('user')
					.useTransaction(true)
					.setLock('pessimistic_write')
					.update(User)
					.set({
						btcBalance: () => `btc_balance + ${withdrawalSat}`,
					})
					.where('id = :id', {id: user.id})
					.execute();

				await queryRunner.commitTransaction();

				throw new CustomError(HttpCodes.UNPROCESSED_CONTENT, 'Payment failed');
			}
			/* 
				remove cache at last not to make anymore transactions to database
				(even when cache error happens),
				and after payment successfully confirmed.
			*/
			cache.del(secret);
			cache.set(
				withdrawalInfo.defaultDescription,
				accumulatedAmount + withdrawalSat,
			);

			/*
				Don't rollback even when push noti fail(not a big deal)
				Don't await for asynchronous performance
			*/
			FBUtil.sendNotification(
				user.fcmToken,
				'HeartBit',
				`You have successfully withdrawn ${withdrawalSat.toLocaleString()} sats.`,
				{type: 'TRANSACTION'},
			);
		} catch (error: any) {
			console.log(error);
			logger.error(error);
			// automatic rollback except lightning payment failure
			error.message != 'Payment failed'
				? await queryRunner.rollbackTransaction()
				: '';

			throw error.code && error.message
				? error
				: new CustomError(
						HttpCodes.INTERNAL_SERVER_ERROR,
						'Internal Server Error',
				  );
		} finally {
			await queryRunner.release();
		}
	}
}

export default new PaymentsService();
