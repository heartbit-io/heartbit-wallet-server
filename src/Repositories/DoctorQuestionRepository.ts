import {DoctorQuestionDataSource} from '../domains/repo';
import {
	DoctorQuestion,
	DoctorQuestionAttributes,
} from '../domains/entities/DoctorQuestion';

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
			.where('doctorId = :doctorId', {doctorId})
			.andWhere('questionId = :questionId', {questionId})
			.execute();
	}
}

export default new DoctorQuestionRepository();
