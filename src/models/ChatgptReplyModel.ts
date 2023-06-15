import {CreationOptional, DataTypes, Model} from 'sequelize';

import dbconnection from '../util/dbconnection';

export interface JsonAnswerInterface {
	[title: string]: string;
	aiAnswer: string;
	doctorAnswer: string;
	guide: string;
	chiefComplaint: string;
	medicalHistory: string;
	currentMedication: string;
	assessment: string;
	plan: string;
	doctorNote: string;
}

export interface ChatgptRepliesAttributes {
	id?: number;
	questionId: CreationOptional<number>;
	model: string;
	maxTokens: number;
	prompt: string;
	rawAnswer: string;
	jsonAnswer: JsonAnswerInterface;
}

export class ChatgptReply extends Model<ChatgptRepliesAttributes> {
	declare id: number;
	declare questionId: CreationOptional<number>;
	declare model: string;
	declare maxTokens: number;
	declare prompt: string;
	declare rawAnswer: string;
	declare jsonAnswer: JsonAnswerInterface;
	declare createdAt: Date;
	declare updatedAt: Date;

	static associate(models: any) {
		// define association here
		ChatgptReply.belongsTo(models.questions, {
			targetKey: 'id',
			foreignKey: 'question_id',
		});
	}
}

ChatgptReply.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		questionId: {
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
		paranoid: true,
		underscored: true,
	},
);
