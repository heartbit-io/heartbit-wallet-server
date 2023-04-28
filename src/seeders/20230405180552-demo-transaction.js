/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createTransaction() {
		return {
			fromUserPubkey: faker.finance.bitcoinAddress(),
			toUserPubkey: faker.helpers.arrayElement(['user', 'doctor', 'admin']),
			amount: faker.finance.amount(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	},
	async up(queryInterface, Sequelize) {
		const dataArray = [];
		for (let i = 0; i < 50; i++) {
			dataArray.push(this.createTransaction());
		}

		return queryInterface.bulkInsert('transactions', dataArray);
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
