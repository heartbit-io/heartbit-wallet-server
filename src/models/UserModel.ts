import {DataTypes, Model} from 'sequelize';

import {UserRoles} from '../util/enums';
import dbconnection from '../util/dbconnection';

export interface UserAttributes {
	id?: number;
	pubkey: string;
	email: string;
	role: UserRoles;
	btc_balance: number;
}

export class UserInstance extends Model<UserAttributes> {
	declare pubkey: string;
	declare email: string;

	declare role: UserRoles;
	declare btc_balance: number;
	static questions: any;

	static associate(models: any) {
		// define association here
		// UserInstance.hasMany(models.questions, {
		// 	sourceKey: 'pubkey',
		// 	foreignKey: 'user_pubkey',
		// });
	}
}

UserInstance.init(
	{
		pubkey: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		role: {
			type: DataTypes.ENUM(...Object.values(UserRoles)),
			allowNull: false,
		},
		btc_balance: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'users',
		timestamps: true,
		// paranoid: true,
	},
);
