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
			},
			rawContent: {
				type: Sequelize.TEXT,
			},
			userId: {
				type: Sequelize.INTEGER,
			},
			bountyAmount: {
				type: Sequelize.DOUBLE,
			},
			status: {
				type: Sequelize.STRING,
				defaultValue: 'Open',
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
		await queryInterface.dropTable('questions');
	},
};
