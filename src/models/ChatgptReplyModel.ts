import {CreationOptional, DataTypes, Model} from 'sequelize';

import dbconnection from '../util/dbconnection';

export interface JsonAnswerInterface {
	[title: string]: string;
	triageGuide: string;
	chiefComplaint: string;
	medicalHistory: string;
	currentMedication: string;
	accessment: string;
	plan: string;
	doctorNote: string;
}

export interface ChatgptRepliesAttributes {
	id?: number;
	question_id: number;
	model: string;
	maxTokens: number;
	prompt: string;
	rawAnswer: string;
	jsonAnswer: JsonAnswerInterface;
}
export class ChatgptReplyInstance extends Model<ChatgptRepliesAttributes> {
	declare question_id: CreationOptional<number>;
	declare model: string;
	declare maxTokens: number;
	declare prompt: string;
	declare rawAnswer: string;
	declare jsonAnswer: JsonAnswerInterface;

	static associate(models: any) {
		// define association here
		ChatgptReplyInstance.belongsTo(models.questions, {
			targetKey: 'id',
			foreignKey: 'question_id',
		});
	}
}

ChatgptReplyInstance.init(
	{
		question_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		maxTokens: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		prompt: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		rawAnswer: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		jsonAnswer: {
			type: DataTypes.JSON,
			allowNull: false,
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'chatgpt_replies',
		timestamps: true,
		// paranoid: true,
	},
);
