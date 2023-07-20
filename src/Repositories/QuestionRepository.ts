import {QuestionDataSource} from '../domains/repo';
import {QuestionStatus} from '../util/enums';
import {QuestionAttributes} from '../domains/entities/Question';
import {In, Not} from 'typeorm';

class QuestionRepository {
	async create(question: QuestionAttributes) {
		return await QuestionDataSource.save({...question});
	}

	async updateStatus(status: QuestionStatus, id: number) {
		return await QuestionDataSource.update(id, {status});
	}

	async getAll(
		userId: number,
		limit: number | undefined,
		offset: number | undefined,
		order: 'ASC' | 'DESC',
	) {
		return await QuestionDataSource.find({
			where: {userId},
			take: limit,
			skip: offset,
			order: {createdAt: order},
		});
	}

	async sumUserOpenBountyAmount(userId: number) {
		return await QuestionDataSource.createQueryBuilder('question')
			.select('SUM(question.bounty_amount)', 'totalBounty')
			.where('question.user_id = :userId', {userId})
			.andWhere('question.status = :status', {status: QuestionStatus.OPEN})
			.groupBy('question.user_id')
			.getRawOne();
	}

	async getQuestion(id: number) {
		return await QuestionDataSource.findOne({
			where: {id},
		});
	}

	async getUserOpenQuestion(id: number, userId: number) {
		return await QuestionDataSource.findOne({
			where: {
				id,
				userId,
				status: QuestionStatus.OPEN,
			},
		});
	}

	async getUserQuestions(userId: number) {
		return await QuestionDataSource.find({where: {userId}});
	}

	async getOpenQuestionsOrderByBounty(offset: number, userId: number) {
		return await QuestionDataSource.find({
			where: {status: QuestionStatus.OPEN, userId: Not(userId)},
			order: {
				bountyAmount: 'DESC',
				createdAt: 'DESC',
			},
			skip: offset,
			take: 1,
		});
	}

	async getUserQuestionsByStatus(userId: number, status: QuestionStatus) {
		return await QuestionDataSource.find({
			where: {userId, status},
		});
	}

	async getDoctorQuestion(id: number) {
		return await QuestionDataSource.findOne({
			where: {
				id,
			},
			relations: {
				chatGptReply: true,
			},
		});
	}

	async getDoctorAnswerdQuestionsByQuestionIds(questionIds: Array<number>) {
		return await QuestionDataSource.findBy({
			id: In(questionIds),
		});
	}

	async deleteQuestion(questionId: number) {
		return await QuestionDataSource.createQueryBuilder()
			.softDelete()
			.where('id = :id', {id: questionId})
			.execute();
	}

	async countUserQuestions(userId: number): Promise<number> {
		return await QuestionDataSource.count({where: {userId}});
	}
}

export default new QuestionRepository();
