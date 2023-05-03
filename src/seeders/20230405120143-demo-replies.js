/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {

		

	createReply(index, doctorIds) {
		return {
			questionId: index,
			userId: faker.helpers.arrayElement(doctorIds),
			content: faker.lorem.paragraph(),
			majorComplaint: faker.lorem.paragraph(),
			medicalHistory: faker.lorem.paragraph(),
			currentMedications: faker.lorem.paragraph(),
			assessment: faker.lorem.paragraph(),
			plan: faker.lorem.paragraph(),
			triage: faker.lorem.paragraph(),
			status: faker.helpers.arrayElement(['open', 'closed']),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	},
	async up(queryInterface, Sequelize) {

		const doctors = await queryInterface.sequelize.query(
			`SELECT id from users where role = 'doctor'`);
		
		const doctorIds = doctors[0].map((doctor) => doctor.id);

		const questionsCount = await queryInterface.sequelize.query(
			`SELECT count(*) from questions`);

		const questionsNumber = questionsCount[0][0].count;
		
		const replies = [];

		for (let index = 1; index < questionsNumber; index++) {
			replies.push(this.createReply(index, doctorIds));
		}
		return queryInterface.bulkInsert('replies', replies);
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
