import env from '../config/env';
import logger from '../util/logger';
import translate from 'deepl';

class DeeplService {
	apiKey: string;
	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	/**
	 * @description - Get translated english text from DeepL
	 * @param text - text to translate
	 */
	async getTextTranslatedIntoEnglish(text: string): Promise<any> {
		try {
			const result = await translate({
				free_api: true,
				text,
				target_lang: 'EN-US',
				auth_key: this.apiKey,
			});

			return result.data.translations[0].text;
		} catch (error) {
			// TODO(david): Sentry alert in slack
			logger.warn(error);
			return;
		}
	}
}

export default new DeeplService(env.DEEPL_API_KEY);
