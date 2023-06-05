/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createQuestion(userIds) {
		return {
			content: faker.lorem.sentences(),
			raw_content: faker.lorem.sentences(),
			raw_content_language: faker.helpers.arrayElement([
				'french',
				'japanese',
				'korean',
				'chinese',
				'tiv',
			]),
			user_id: faker.helpers.arrayElement(userIds),
			bounty_amount: faker.finance.amount(),
			status: faker.helpers.arrayElement(['Open', 'Closed']),
			created_at: new Date(),
			updated_at: new Date(),
			deleted_at: null,
		};
	},

	async up(queryInterface, Sequelize) {
		const questions = [];

		const users = await queryInterface.sequelize.query(
			`SELECT id from users where role = 'user'`,
		);

		const userIds = users[0].map(user => user.id);

		Array.from({length: 50}).forEach(() => {
			questions.push(this.createQuestion(userIds));
		});
		return queryInterface.bulkInsert('questions', questions);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('questions', null, {});
	},
};
