import {QuestionDataSource} from '../domains/repo';
import {QuestionStatus} from '../util/enums';
import {QuestionAttributes, Question} from '../domains/entities/Question';
import {In} from 'typeorm';

class QuestionRepository {
	async create(question: QuestionAttributes) {
		return await QuestionDataSource.save({...question});
	}

	async updateStatus(status: QuestionStatus, id: number) {
		// return await Question.update({status}, {where: {id}});
		return await QuestionDataSource.update(id, {status});
	}

	//get all user questions
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

	async getOpenQuestionsOrderByBounty(
		limit?: number | undefined,
		offset?: number | undefined,
	) {
		return await QuestionDataSource.find({
			where: {status: QuestionStatus.OPEN},
			take: limit,
			skip: offset,
			order: {
				bountyAmount: 'DESC',
				createdAt: 'ASC',
			},
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
