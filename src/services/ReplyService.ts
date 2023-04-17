import {ReplyInstance, RepliesAttributes} from '../models/ReplyModel';

class ReplyService {
	async createReply(reply: RepliesAttributes) {
		return await ReplyInstance.create({
			...reply,
		});
	}

	async getReplyById(id: number) {
		return await ReplyInstance.findOne({
			where: {id},
		});
	}

	async getUserReplies(user_pubkey: string) {
		return await ReplyInstance.findAll({where: {user_pubkey}});
	}

	async getQuestionReplies(question_id: number) {
		return await ReplyInstance.findAll({where: {question_id}});
	}

	async getUserReply(id: number, user_pubkey: string) {
		return await ReplyInstance.findOne({
			where: {id, user_pubkey},
		});
	}

	async getQuestionBestReply(question_id: number) {
		return await ReplyInstance.findOne({
			where: {question_id, best_reply: true},
		});
	}

	async deleteReply(reply: ReplyInstance) {
		return await reply.destroy();
	}

	async updateReply(reply: ReplyInstance) {
		return await reply.update({ best_reply: true });
	}
}

export default new ReplyService();
