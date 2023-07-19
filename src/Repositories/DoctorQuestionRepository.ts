import {DoctorQuestionDataSource} from '../domains/repo';
import {
	DoctorQuestion,
	DoctorQuestionAttributes,
} from '../domains/entities/DoctorQuestion';
import {Question} from '../domains/entities/Question';

class DoctorQuestionRepository {
	async createDoctorQuestion(
		doctorQuestion: DoctorQuestionAttributes,
	): Promise<DoctorQuestion> {
		return await DoctorQuestionDataSource.save({...doctorQuestion});
	}

	async getDoctorQuestionStatus(
		doctorId: number,
		questionId: number,
	): Promise<DoctorQuestion | null> {
		return await DoctorQuestionDataSource.findOne({
			where: {
				doctorId,
				questionId,
			},
		});
	}

	async deleteDoctorQuestion(doctorId: number, questionId: number) {
		return await DoctorQuestionDataSource.createQueryBuilder()
			.softDelete()
			.where('doctor_id = :doctorId', {doctorId})
			.andWhere('question_id = :questionId', {questionId})
			.execute();
	}

	async getAssignedDoctorId(questionId: number): Promise<number | undefined> {
		const result = await DoctorQuestionDataSource.findOne({
			where: {questionId},
		});
		return result?.doctorId;
	}

	async getDoctorQuestions(doctorId: number): Promise<DoctorQuestion | null> {
		return await DoctorQuestionDataSource.findOne({
			where: {doctorId},
			select: {questionId: true},
		});
	}
}

export default new DoctorQuestionRepository();
