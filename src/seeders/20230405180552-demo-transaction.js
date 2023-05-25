/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createTransaction(userPubkeys, doctorPubkeys) {
		return {
			from_user_pubkey: faker.helpers.arrayElement(userPubkeys),
			to_user_pubkey: faker.helpers.arrayElement(doctorPubkeys),
			amount: faker.finance.amount(),
			created_at: new Date(),
			updated_at: new Date(),
			deleted_at: null,
		};
	},
	async up(queryInterface, Sequelize) {
		const dataArray = [];

		const userPublicKeys = await queryInterface.sequelize.query(
			`SELECT pubkey from users where role = 'user'`);
		
		const userPubkeys = userPublicKeys[0].map((user) => user.pubkey);

		const doctorPublickeys = await queryInterface.sequelize.query(
			`SELECT pubkey from users where role = 'doctor'`);
		
		const doctorPubkeys = doctorPublickeys[0].map((doctor) => doctor.pubkey);
	

		for (let i = 0; i < 50; i++) {
			dataArray.push(this.createTransaction(userPubkeys, doctorPubkeys));
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
