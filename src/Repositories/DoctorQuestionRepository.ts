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
}

export default new DoctorQuestionRepository();
