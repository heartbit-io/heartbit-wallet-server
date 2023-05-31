import {DataTypes, Model} from 'sequelize';
import dbconnection from '../util/dbconnection';

export interface TxRequestAttributes {
	id?: number;
	userId: number;
	amount: number;
	secret: string;
	status?: string;
}

export class TxRequest extends Model<TxRequestAttributes> {
	declare id: number;
	declare userId: number;
	declare amount: number;
	declare secret: string;
	declare status: string;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	static associate(models: any) {}
}

TxRequest.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		userId: {
			type: DataTypes.INTEGER,
		},
		amount: {
			type: DataTypes.DOUBLE,
		},
		secret: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'created',
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'tx_requests',
		timestamps: true,
		paranoid: true,
		underscored: true,
	},
);
