import * as dotenv from 'dotenv';

import { Configuration, OpenAIApi } from 'openai';

import logger from '../util/logger';

dotenv.config();

const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY as string;

class ChatgptService {
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    this.openai = new OpenAIApi(new Configuration({ apiKey }));
  }

  /**
   * @description - Get ChatGPT Completion for prompt
   * @param prompt - Question
   * @param model 
   * @param max_tokens - For English text, 1 token is approximately 4 characters or 0.75 words
   * @returns 
   */
  async getCompletion(
    prompt: string,
    model = 'text-davinci-003',
    max_tokens: number
  ): Promise<string | undefined> {
    try {
      const completion  = await this.openai.createCompletion({
        model,
        prompt,
        max_tokens
      });

      return completion.data.choices[0].text;
    } catch (error) {
      // TODO(david): Sentry alert in slack
      logger.warn(error);
      return;
    }
  }
}

export default new ChatgptService(OPEN_AI_API_KEY);
