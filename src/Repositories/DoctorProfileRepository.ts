import {
	DoctorProfileDataSource,
	DoctorQuestionDataSource,
} from '../domains/repo';
import {
	DoctorProfile,
	DoctorProfileAttributes,
} from '../domains/entities/DoctorProfile';

class DoctorProfileRepository {
	async saveDoctorProfile(
		doctorProfile: DoctorProfileAttributes,
	): Promise<DoctorProfile> {
		return await DoctorProfileDataSource.save({...doctorProfile});
	}

	async getDoctorProfile(userId: number): Promise<DoctorProfile | null> {
		return await DoctorProfileDataSource.findOne({
			where: {
				userId,
			},
		});
	}

	async deleteDoctorProfile(userId: number) {
		return await DoctorProfileDataSource.createQueryBuilder()
			.delete()
			.where('userId = :userId', {userId})
			.execute();
	}
}

export default new DoctorProfileRepository();
