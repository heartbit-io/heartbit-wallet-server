import {DataTypes, Model} from 'sequelize';

import dbconnection from '../util/dbconnection';

export enum QuestionStatus {
	Open = 'Open',
	Closed = 'Closed',
}

export interface QuestionAttributes {
	id?: number;
	totalBounty?: unknown;
	content: string;
	userId: number;
	bountyAmount: number;
	status?: QuestionStatus;
}
export class QuestionInstance extends Model<QuestionAttributes> {
	declare id: number;
	declare content: string;
	declare userId: number;
	declare bountyAmount: number;
	declare status: string;
	declare dataValues: QuestionAttributes;

	static associate(models: any) {
		// define association here
	}
}

QuestionInstance.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		bountyAmount: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM('Open', 'Closed'),
			allowNull: false,
			defaultValue: 'Open',
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'questions',
		timestamps: true,
		paranoid: true,
	},
);
