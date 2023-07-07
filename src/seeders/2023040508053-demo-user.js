/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createUser(index) {
		return {
			role: faker.helpers.arrayElement(['user', 'doctor', 'admin']),
			btc_balance: faker.finance.amount(),
			email: faker.internet.email(),
			pubkey: faker.finance.bitcoinAddress() + new Date().getTime().toString(),
			air_table_record_id: index,
			promotionBtcBalance: faker.finance.amount(),
			created_at: new Date(),
			updated_at: new Date(),
			deleted_at: null,
		};
	},
	async up(queryInterface, Sequelize) {
		let users = [];

		for (let index = 1; index < 50; index++) {
			users.push(this.createUser(index));
		}

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
