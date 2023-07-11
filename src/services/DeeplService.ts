import * as Sentry from '@sentry/node';

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
	async getTextTranslatedIntoEnglish(
		text: string,
		targetLanguage?: translate.DeeplLanguages,
	): Promise<any> {
		try {
			const language: translate.DeeplLanguages = targetLanguage
				? targetLanguage
				: 'EN-US';

			const result = await translate({
				free_api: true,
				text,
				target_lang: language,
				auth_key: this.apiKey,
			});

			return result.data.translations[0];
		} catch (error) {
			Sentry.captureMessage(`DeepL error: ${error}`);
			logger.warn(error);
			return;
		}
	}
}

export default new DeeplService(env.DEEPL_API_KEY);
