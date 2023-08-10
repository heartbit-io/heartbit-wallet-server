import {faker} from '@faker-js/faker';

export const airTableDoctorDetails = () => {
	return {
		fields: {
			'First Name': 'John',
			'Last Name': 'Doe',
		},
	};
};

export const mockTranslatedContent = () => {
	return {
		translatedDoctorNote: {
			text: faker.lorem.paragraph(),
		},
		translatedTitle: {
			text: faker.lorem.sentence(),
		},
	};
};
