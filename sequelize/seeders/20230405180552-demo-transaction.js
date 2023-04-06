/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = {
			from_user_pubkey: faker.finance.bitcoinAddress(),
      to_user_pubkey: faker.helpers.arrayElement(['user', 'doctor', 'admin']),
      amount: faker.finance.amount(),
			createdAt: new Date(), 
			updatedAt: new Date(),
		};

		const dataArray = [];
		for (let i = 0; i < 50; i++) {
			dataArray.push(data);
		}

		return queryInterface.bulkInsert('transactions', dataArray);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
