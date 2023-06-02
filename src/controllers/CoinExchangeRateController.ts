import {Request, Response} from 'express';
import * as Sentry from '@sentry/node';
import CoinPaprikaService from '../services/CoinPaprikaService';
import {HttpCodes} from '../util/HttpCodes';
import ResponseDto from '../dto/ResponseDTO';

class CoinExchangeRateController {
	async getBtcExchangeRate(req: Request, res: Response) {
		try {
			const {satoshi} = req.query;

			const btcExchageRate = await CoinPaprikaService.getBtcExchageRate(
				Number(satoshi),
			);

			return res
				.status(HttpCodes.OK)
				.json(
					new ResponseDto(
						true,
						HttpCodes.OK,
						'Successfully retrieved btc exchage rate',
						btcExchageRate,
					),
				);
		} catch (error) {
			return res
				.status(HttpCodes.INTERNAL_SERVER_ERROR)
				.json(
					new ResponseDto(false, HttpCodes.INTERNAL_SERVER_ERROR, error, null),
				);
		}
	}
}

export default new CoinExchangeRateController();
