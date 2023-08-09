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
		replyId: faker.number.int({min: 1, max: 50}),
		translatedDoctorNote: faker.lorem.paragraph(),
		translatedTitle: faker.lorem.sentence(),
	};
};
