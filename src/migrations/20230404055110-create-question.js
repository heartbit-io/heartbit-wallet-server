/* eslint-disable no-undef */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('questions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			content: {
				type: Sequelize.TEXT,
			},
			rawContentLanguage: {
				type: Sequelize.STRING,
				field: 'raw_content_language',
			},
			rawContent: {
				type: Sequelize.TEXT,
				field: 'raw_content',
			},
			userId: {
				type: Sequelize.INTEGER,
				field: 'user_id',
			},
			bountyAmount: {
				type: Sequelize.DOUBLE,
				field: 'bounty_amount',
			},
			type: {
				type: Sequelize.STRING,
				defaultValue: 'GENERAL',
			},
			currentMedication: {
				type: Sequelize.TEXT,
				allowNull: false,
				field: 'current_medication',
			},
			ageSexEthnicity: {
				type: Sequelize.TEXT,
				allowNull: false,
				field: 'age_sex_ethnicity',
			},
			pastIllnessHistory: {
				type: Sequelize.TEXT,
				allowNull: false,
				field: 'past_illness_history',
			},
			others: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			status: {
				type: Sequelize.STRING,
				defaultValue: 'Open',
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
				field: 'deleted_at',
			},
		});
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('questions');
	},
};
