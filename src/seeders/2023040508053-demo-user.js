/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createUser() {
		return {
			role: faker.helpers.arrayElement(['user', 'doctor', 'admin']),
			btcBalance: faker.finance.amount(),
			email: faker.internet.email(),
			pubkey: faker.finance.bitcoinAddress() + new Date().getTime().toString(),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	},
	async up(queryInterface, Sequelize) {
		let users = [];

		Array.from({length: 50}).forEach(() => {
			users.push(this.createUser());
		});

		return queryInterface.bulkInsert('users', users);
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
