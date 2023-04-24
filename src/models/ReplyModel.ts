import {CreationOptional, DataTypes, Model} from 'sequelize';

import dbconnection from '../util/dbconnection';

export interface RepliesAttributes {
	id?: number;
	question_id: number;
	user_email: string;
	content: string;
	best_reply?: boolean;
}

export class ReplyInstance extends Model<RepliesAttributes> {
	declare question_id: CreationOptional<number>;

	declare content: string;

	declare user_email: string;

	declare best_reply: boolean;

	declare bounty_amount: number;

	static associate(models: any) {
		// define association here
		ReplyInstance.belongsTo(models.questions, {
			targetKey: 'id',
			foreignKey: 'question_id',
		});
	}
}

ReplyInstance.init(
	{
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		user_email: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		question_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		best_reply: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'replies',
		timestamps: true,
		// paranoid: true,
	},
);
