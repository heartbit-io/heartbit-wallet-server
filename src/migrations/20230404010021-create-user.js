module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				type: Sequelize.INTEGER,
			},
			pubkey: {
				type: Sequelize.STRING,
				allowNull: false,
				primaryKey: true,
			},
			role: {
				type: Sequelize.STRING,
				defaultValue: 'user',
			},
			btcBalance: {
				type: Sequelize.DOUBLE,
				field: 'btc_balance',
			},
			airTableRecordId: {
				type: Sequelize.STRING,
				unique: true,
				field: 'air_table_record_id',
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
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
		await queryInterface.dropTable('users');
	},
};
