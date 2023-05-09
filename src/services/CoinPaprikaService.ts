import NodeCache from 'node-cache';
import https from 'https';
import logger from '../util/logger';

const cache = new NodeCache();

class CoinPaprikaService {
	private fetchData = async (): Promise<any> => {
		const cacheKey = `btcExchangeRate`;

		const cachedValue = cache.get(cacheKey);
		if (cachedValue) return cachedValue;

		// get 10,000(0.0001 btc) satoshi to usd
		const value = new Promise((resolve, reject) => {
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
		// auto delete after 1 hour
		cache.set(cacheKey, value, 3600);
		return value;
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
				customSatoshi: satoshi ? (satoshi * usd10000) / 10000 : 0,
			};
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}
}

export default new CoinPaprikaService();
