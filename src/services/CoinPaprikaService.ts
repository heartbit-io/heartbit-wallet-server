import env from '../config/env';
import https from 'https';
import logger from '../util/logger';

class CoinPaprikaService {
	private fetchData = async (): Promise<any> => {
		// get 10,000(0.0001 btc) satoshi to usd
		return new Promise((resolve, reject) => {
			const url =
				process.env.COINPAPRIKA_URL +
				'price-converter?base_currency_id=btc-bitcoin&quote_currency_id=usd-us-dollars&amount=0.0001';
			const options = {
				method: 'GET',
				json: true,
			};

			https
				.get(url, options, res => {
					let data = '';
					res.on('data', chunk => (data += chunk));
					res.on('end', () => resolve(JSON.parse(data)));
				})
				.on('error', error => {
					reject(error);
				});
		});
	};

	/**
	 * @description - Get Coinpaprika BTC exchange rate
	 * @param satoshi - Satoshi value for user
	 */
	async getBtcExchageRate(satoshi: number): Promise<any> {
		try {
			// get 10,000 sats and calculate other values
			const {price: usd10000} = await this.fetchData();

			return {
				10000: usd10000,
				1000: usd10000 / 10,
				custumSatoshi: satoshi ? (satoshi * usd10000) / 10000 : 0,
			};
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}
}

export default new CoinPaprikaService();
