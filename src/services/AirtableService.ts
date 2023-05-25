import env from '../config/env';
import https from 'https';
import logger from '../util/logger';

class AirtableService {
	apiKey: string;
	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private fetchData = async (airTableRecordId: string) => {
		return new Promise((resolve, reject) => {
			const url = env.AIRTABLE_URL + '/' + `${airTableRecordId}`;
			const options = {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
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
	 * @description - Get Airtable registered doctor info
	 * @param airTableRecordId - airtable record ID
	 */
	async getAirtableDoctorInfo(airTableRecordId: string): Promise<any> {
		try {
			return await this.fetchData(airTableRecordId);
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}
}

export default new AirtableService(env.AIRTABLE_API_KEY);
