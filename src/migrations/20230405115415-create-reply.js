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
				field: 'question_id',
			},
			userId: {
				type: Sequelize.INTEGER,
				field: 'user_id',
			},
			title: {
				type: Sequelize.TEXT,
			},
			majorComplaint: {
				type: Sequelize.TEXT,
				field: 'major_complaint',
			},
			medicalHistory: {
				type: Sequelize.TEXT,
				field: 'medical_history',
			},
			currentMedications: {
				type: Sequelize.TEXT,
				field: 'current_medications',
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
				field: 'created_at',
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				field: 'updated_at',
			},
			deletedAt: {
				allowNull: true,
				type: Sequelize.DATE,
				field: 'deleted_at'
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('replies');
	},
};
