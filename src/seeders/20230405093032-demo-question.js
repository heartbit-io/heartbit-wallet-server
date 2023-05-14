/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createQuestion(userIds) {
		return {
			content: faker.lorem.sentences(),
			rawContent: faker.lorem.sentences(),
			userId: faker.helpers.arrayElement(userIds),
			bountyAmount: faker.finance.amount(),
			status: faker.helpers.arrayElement(['Open', 'Closed']),
			createdAt: new Date(),
			updatedAt: new Date(),
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
