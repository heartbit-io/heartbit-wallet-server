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
			questionId: {
				type: Sequelize.INTEGER,
			},
			userId: {
				type: Sequelize.INTEGER,
			},
			title: {
				type: Sequelize.TEXT,
			},
			majorComplaint: {
				type: Sequelize.TEXT,
			},
			medicalHistory: {
				type: Sequelize.TEXT,
			},
			currentMedications: {
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
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('replies');
	},
};
