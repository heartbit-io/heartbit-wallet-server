import {RepliesAttributes} from '../domains/entities/Reply';
import {ReplyDataSource} from '../domains/repo';

class ReplyRepository {
	async createReply(reply: RepliesAttributes) {
		return ReplyDataSource.save({
			...reply,
		});
	}

	async getReplyById(id: number) {
		return await ReplyDataSource.findOne({
			where: {id},
		});
	}

	async getUserReplies(userId: number) {
		return await ReplyDataSource.find({where: {userId}});
	}

	async getQuestionReplies(questionId: number) {
		return await ReplyDataSource.find({where: {questionId}});
	}

	async getReplyByQuestionId(questionId: number) {
		return await ReplyDataSource.findOne({
			where: {questionId},
		});
	}

	async getUserReply(id: number, userId: number) {
		return await ReplyDataSource.findOne({
			where: {id, userId},
		});
	}

	async getDoctorReplies(userId: number) {
		return await ReplyDataSource.find({
			where: {userId},
		});
	}

	async getDoctorReply(questionId: number, userId: number) {
		return await ReplyDataSource.findOne({
			where: {questionId, userId},
		});
	}

	async deleteReply(replyId: number) {
		// return await ReplyDataSource.softDelete(reply);
		return await ReplyDataSource.createQueryBuilder()
			.softDelete()
			.where('id = :id', {id: replyId})
			.execute();
	}
}

export default new ReplyRepository();
