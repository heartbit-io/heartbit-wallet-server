/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createQuestion() {
		return {
			content: faker.lorem.sentences(),
			user_email: faker.finance.bitcoinAddress(),
			bounty_amount: faker.finance.amount(),
			status: faker.helpers.arrayElement(['open', 'closed']),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	},

	async up(queryInterface, Sequelize) {
		const questions = [];

		Array.from({length: 50}).forEach(() => {
			questions.push(this.createQuestion());
			
		});
		return queryInterface.bulkInsert('questions', questions);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('questions', null, {});
	},
};
