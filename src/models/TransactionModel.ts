import {DataTypes, Model} from 'sequelize';
import dbconnection from '../util/dbconnection';

interface TransactionAttributes {
	id?: number;
	from_user_pubkey: string;
	to_user_pubkey: string;
	amount: number;
}
export class TransactionInstance extends Model<TransactionAttributes> {
	declare from_user_pubkey: string;

	declare to_user_pubkey: string;

	declare amount: number;

	static associate(models: any) {
		// define association here
	}
}

TransactionInstance.init(
	{
		from_user_pubkey: {
			type: DataTypes.STRING,
			allowNull: false,
			references: {
				model: 'users',
				key: 'pubkey',
			},
		},
		to_user_pubkey: {
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
