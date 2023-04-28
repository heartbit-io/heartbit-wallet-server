/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	createReply() {
		return {
			questionId: faker.helpers.arrayElement([...Array(50).keys()]),
			userId: faker.datatype.number({min: 1, max: 50}),
			content: faker.lorem.paragraph(),
			bestReply: faker.helpers.arrayElement([true, false]),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
	},
	async up(queryInterface, Sequelize) {
		const replies = [];

		Array.from({length: 50}).forEach(() => {
			replies.push(this.createReply());
		});
		return queryInterface.bulkInsert('replies', replies);
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
