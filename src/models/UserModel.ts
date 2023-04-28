import {DataTypes, Model} from 'sequelize';

import {UserRoles} from '../util/enums';
import dbconnection from '../util/dbconnection';

export interface UserAttributes {
	id?: number;
	pubkey: string;
	email: string;
	role: UserRoles;
	btcBalance: number;
}

export class UserInstance extends Model<UserAttributes> {
	declare id: number;
	declare pubkey: string;
	declare email: string;
	declare role: UserRoles;
	declare btcBalance: number;

	static associate(models: any) {
		UserInstance.hasMany(models.questions, {
			sourceKey: 'pubkey',
			foreignKey: 'userId',
		});
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
		btcBalance: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'users',
		timestamps: true,
		paranoid: true,
	},
);
