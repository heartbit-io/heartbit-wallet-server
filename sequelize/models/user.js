/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			pubkey: DataTypes.STRING,
			role: DataTypes.ENUM,
			btc_balance: DataTypes.NUMBER,
		},
		{
			sequelize,
			modelName: 'User',
		},
	);
	return User;
};
