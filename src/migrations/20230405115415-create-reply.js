/* eslint-disable no-undef */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('replies', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			question_id: {
				type: Sequelize.INTEGER,
			},
			user_email: {
				type: Sequelize.STRING,
			},
			major_complaint: {
				type: Sequelize.TEXT,
			},
			medical_history: {
				type: Sequelize.TEXT,
			},
			current_medications: {
				type: Sequelize.TEXT,
			},
			assessment: {
				type: Sequelize.TEXT,
			},
			plan: {
				type: Sequelize.TEXT,
			},
			triage: {
				type: Sequelize.TEXT,
			},
			content: {
				type: Sequelize.TEXT,
			},
			status: {
				type: Sequelize.STRING,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			deletedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			}
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('replies');
	},
};
