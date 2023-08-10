import {RepliesAttributes, Reply} from '../domains/entities/Reply';
import dataSource, {ReplyDataSource} from '../domains/repo';

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
			relations: {
				question: true,
			},
			order: {createdAt: 'DESC'},
		});
	}

	async getDoctorReply(questionId: number, userId: number) {
		return await ReplyDataSource.findOne({
			where: {questionId, userId},
		});
	}

	async deleteReply(replyId: number) {
		return await ReplyDataSource.createQueryBuilder()
			.softDelete()
			.where('id = :id', {id: replyId})
			.execute();
	}

	async getDoctorIdByQuestionId(
		questionId: number,
	): Promise<number | undefined> {
		const reply = await ReplyDataSource.findOne({
			where: {questionId},
		});
		return reply?.userId;
	}

	async updateReplyTranslatedContent(
		id: number,
		translatedContent: string,
		translatedTitle: string,
	) {
		return await dataSource
			.createQueryBuilder()
			.update(Reply)
			.set({translatedContent, translatedTitle})
			.where('id = :id', {id})
			.execute();
	}

	async updateReplyTranslatedContentColumn(
		id: number,
		translatedContent: string,
	) {
		return await dataSource
			.createQueryBuilder()
			.update(Reply)
			.set({translatedContent})
			.where('id = :id', {id})
			.execute();
	}

	async updateReplyTranslatedTitleColumn(id: number, translatedTitle: string) {
		return await dataSource
			.createQueryBuilder()
			.update(Reply)
			.set({translatedTitle})
			.where('id = :id', {id})
			.execute();
	}
}

export default new ReplyRepository();
