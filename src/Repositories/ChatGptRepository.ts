import {ChatGPTDataSource} from '../domains/repo';
import {
	ChatGptReply,
	ChatGptReplyAttributes,
} from '../domains/entities/ChatGptReply';

class ChatGptRepository {
	async createChaptGptReply(
		chatGptReply: ChatGptReplyAttributes,
	): Promise<ChatGptReply> {
		return await ChatGPTDataSource.save(chatGptReply);
	}

	async getChatGptReply(questionId: number): Promise<ChatGptReply | null> {
		return await ChatGPTDataSource.findOne({
			where: {questionId},
		});
	}
}

export default new ChatGptRepository();
