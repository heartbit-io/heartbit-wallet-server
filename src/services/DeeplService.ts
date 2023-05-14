import env from '../config/env';
import https from 'https';
import logger from '../util/logger';

class DeeplService {
	apiKey: string;
	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	private fetchData = async (text: string) => {
		return new Promise((resolve, reject) => {
			const options = {
				hostname: 'api-free.deepl.com',
				path: '/v2/translate',
				method: 'POST',
				headers: {
					Authorization: `DeepL-Auth-Key ${this.apiKey}`,
				},
				json: true,
			};

			const postData = JSON.stringify({
				text,
				target_lang: 'EN-US',
			});

			const req = https.request(options, res => {
				res.on('data', d => {
					process.stdout.write(d);
				});
			});

			req.on('error', e => {
				logger.warn(e);
			});

			req.write(postData);
			req.end();
		});
	};

	/**
	 * @description - Get translated english text from DeepL
	 * @param text - text to translate
	 */
	async getTextTranslatedIntoEnglish(text: string): Promise<any> {
		try {
			const result = await this.fetchData(text);

			return result;
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}
}

export default new DeeplService(env.DEEPL_API_KEY);
