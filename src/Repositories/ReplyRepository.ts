import {RepliesAttributes, Reply} from '../models/ReplyModel';

class ReplyRepository {
	async createReply(reply: RepliesAttributes) {
		return await Reply.create({
			...reply,
		});
	}

	async getReplyById(id: number) {
		return await Reply.findOne({
			where: {id},
		});
	}

	async getUserReplies(userId: number) {
		return await Reply.findAll({where: {userId}});
	}

	async getQuestionReplies(questionId: number) {
		return await Reply.findAll({where: {questionId}});
	}

	async getReplyByQuestionId(questionId: number) {
		return await Reply.findOne({
			where: {questionId},
		});
	}

	async getUserReply(id: number, userId: number) {
		return await Reply.findOne({
			where: {id, userId},
		});
	}

	async getDoctorReplies(userId: number) {
		return await Reply.findAll({
			where: {userId},
		});
	}

	async getDoctorReply(questionId: number, userId: number) {
		return await Reply.findOne({
			where: {questionId, userId},
		});
	}

	async deleteReply(reply: Reply) {
		return await reply.destroy();
	}
}

export default new ReplyRepository();
