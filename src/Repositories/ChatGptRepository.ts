import {ChatGPTDataSource} from '../domains/repo';
import {
	ChatGptReply,
	ChatgptRepliesAttributes,
} from '../domains/entities/ChatGptReply';

class ChatGptRepository {
	async createChaptgptReply(
		chatGptReply: ChatgptRepliesAttributes,
	): Promise<ChatGptReply> {
		return await ChatGPTDataSource.save({...chatGptReply});
	}

	async getChatgptReply(questionId: number): Promise<ChatGptReply | null> {
		return await ChatGPTDataSource.findOne({
			where: {questionId},
		});
	}
}

export default new ChatGptRepository();
