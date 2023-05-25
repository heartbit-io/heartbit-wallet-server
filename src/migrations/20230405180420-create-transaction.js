/* eslint-disable no-undef */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('btc_transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fromUserPubkey: {
        type: Sequelize.STRING,
        field: 'from_user_pubkey',
      },
      toUserPubkey: {
        type: Sequelize.STRING,
        field: 'to_user_pubkey',
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      fee: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
      },
      type: {
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
        field: 'deleted_at',
			}
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('btc_transactions');
  }
};
