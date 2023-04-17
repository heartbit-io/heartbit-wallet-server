import {DataTypes, Model} from 'sequelize';
import dbconnection from '../util/dbconnection';

export interface UserAttributes {
	id?: number;
	pubkey: string;
	role: string;
	btc_balance: number;
}

export enum UserRoles {
	USER = 'user',
	ADMIN = 'admin',
	DOCTOR = 'doctor',
}
export class UserInstance extends Model<UserAttributes> {
	declare pubkey: string;

	declare role: string;

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
		role: {
			type: DataTypes.ENUM(''),
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
		paranoid: true,
	},
);

