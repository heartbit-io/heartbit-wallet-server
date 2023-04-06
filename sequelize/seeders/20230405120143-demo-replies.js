/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const { faker } = require('@faker-js/faker');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = {
			question_id: faker.helpers.arrayElement([...Array(50).keys()]),
			user_pubkey: faker.finance.bitcoinAddress(),
			content: faker.lorem.paragraph(),
			best_reply: faker.helpers.arrayElement([true, false]),
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const dataArray = [];
		for (let i = 0; i < 50; i++) {
			dataArray.push(data);
		}

		return queryInterface.bulkInsert('replies', dataArray);
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
