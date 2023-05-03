import {DataTypes, Model} from 'sequelize';

import dbconnection from '../util/dbconnection';

export interface TransactionAttributes {
	id?: number;
	fromUserPubkey: string;
	toUserPubkey: string;
	amount: number;
}
export class TransactionInstance extends Model<TransactionAttributes> {
	declare id: number;
	declare fromUserPubkey: string;
	declare toUserPubkey: string;
	declare amount: number;

	static associate(models: any) {
		// define association here
	}
}

TransactionInstance.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		fromUserPubkey: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'users',
				key: 'pubkey',
			},
		},
		toUserPubkey: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'users',
				key: 'pubkey',
			},
		},
		amount: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'transactions',
		timestamps: true,
		paranoid: true,
	},
);
