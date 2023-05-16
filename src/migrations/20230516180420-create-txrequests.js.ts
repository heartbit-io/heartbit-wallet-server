/* eslint-disable no-undef */
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    await queryInterface.createTable('txRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
    },
      amount: {
        type: Sequelize.DOUBLE
      },
      secret: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
				allowNull: true,
				type: Sequelize.DATE,
			}
    });
  },
  async down(queryInterface:any, Sequelize:any) {
    await queryInterface.dropTable('txRequests');
  }
};
