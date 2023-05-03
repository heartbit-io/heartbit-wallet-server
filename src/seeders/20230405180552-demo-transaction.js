/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createTransaction(userPubkeys, doctorPubkeys) {
		return {
			fromUserPubkey: faker.helpers.arrayElement(userPubkeys),
			toUserPubkey: faker.helpers.arrayElement(doctorPubkeys),
			amount: faker.finance.amount(),
			createdAt: new Date(),
			updatedAt: new Date(),
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
