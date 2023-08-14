import {expect} from 'chai';
import {afterEach, after, before} from 'mocha';
import dataSource, {
	DoctorProfileDataSource,
	userDataSource,
} from '../../../src/domains/repo';
import {doctorProfile, saveDoctorProfile} from '../../mocks';
import DoctorProfileRepository from '../../../src/Repositories/DoctorProfileRepository';

describe('Question Repository queries', () => {
	before(async () => {
		await dataSource.initialize();
	});
	after(async () => {
		dataSource.destroy();
	});
	afterEach(async () => {
		await DoctorProfileDataSource.delete({});
		await userDataSource.delete({});
	});

	it('should save a doctor profile', async () => {
		const result = await saveDoctorProfile(doctorProfile());
		expect(result).to.be.an('object');
		expect(result).to.have.property('id');
		expect(result).to.have.property('userId');
		expect(result).to.have.property('firstName');
		expect(result).to.have.property('lastName');
		expect(result).to.have.property('updatedAt');
		expect(result).to.have.property('createdAt');
	});
	it('should get a doctor profile', async () => {
		const doctor = await saveDoctorProfile(doctorProfile());
		const results = await DoctorProfileRepository.getDoctorProfile(
			doctor.userId,
		);
		expect(results).to.be.an('object');
		expect(results).to.have.property('id');
		expect(results).to.have.property('userId');
		expect(results).to.have.property('firstName');
		expect(results).to.have.property('lastName');
	});
});
