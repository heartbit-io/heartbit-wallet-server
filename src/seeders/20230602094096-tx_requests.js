/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createTransaction(userPubkeys) {
		return {
			user_id: faker.helpers.arrayElement(userPubkeys),
			amount: faker.finance.amount(),
			secret: faker.finance.bitcoinAddress(),
			status: faker.helpers.arrayElement(['created', 'paid', 'closed']),
			created_at: new Date(),
			updated_at: new Date(),
			deleted_at: null,
		};
	},
	async up(queryInterface, Sequelize) {
		const dataArray = [];

		const userIds = await queryInterface.sequelize.query(
			`SELECT id from users`,
		);

		const userId = userIds[0].map(user => user.id);
		for (let i = 0; i < 50; i++) {
			dataArray.push(this.createTransaction(userId));
		}

		return queryInterface.bulkInsert('tx_requests', dataArray);
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
