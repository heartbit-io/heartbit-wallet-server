import {DataTypes, Model} from 'sequelize';
import dbconnection from '../util/dbconnection';

export enum QuestionStatus {
	Open = 'Open',
	Closed = 'Closed',
}

export interface QuestionAttributes {
	total_bounty?: unknown;
	id?: number;
	content: string;
	user_email: string;
	bounty_amount: number;
	status?: QuestionStatus;
}
export class QuestionInstance extends Model<QuestionAttributes> {
	declare id: number;
	declare content: string;

	declare user_email: string;

	declare bounty_amount: number;

	declare status: string;

	declare dataValues: QuestionAttributes;

	static associate(models: any) {
		// define association here
	}
}

QuestionInstance.init(
	{
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		user_email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		bounty_amount: {
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
		// paranoid: true,
	},
);
