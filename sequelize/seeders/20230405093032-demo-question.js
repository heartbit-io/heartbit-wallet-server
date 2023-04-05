/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		const data = {
			content: faker.lorem.sentences(),
			user_pubkey: faker.finance.bitcoinAddress(),
			bounty_amount: faker.finance.amount(),
			status: faker.helpers.arrayElement(['open', 'closed']),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const dataArray = [];
		for (let i = 0; i < 50; i++) {
			dataArray.push(data);
		}

		return queryInterface.bulkInsert('questions', dataArray);
	},

	async down(queryInterface, Sequelize) {
		return queryInterface.bulkDelete('questions', null, {});
	},
};
