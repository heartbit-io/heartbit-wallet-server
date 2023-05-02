import {RepliesAttributes, ReplyInstance} from '../models/ReplyModel';

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

	async getUserReplies(userId: number) {
		return await ReplyInstance.findAll({where: {userId}});
	}

	async getQuestionReplies(questionId: number) {
		return await ReplyInstance.findAll({where: {questionId}});
	}

	async getReplyByQuestionId(questionId: number) {
		return await ReplyInstance.findOne({
			where: {questionId},
		});
	}

	async getUserReply(id: number, userId: number) {
		return await ReplyInstance.findOne({
			where: {id, userId},
		});
	}

	async deleteReply(reply: ReplyInstance) {
		return await reply.destroy();
	}
}

export default new ReplyService();
