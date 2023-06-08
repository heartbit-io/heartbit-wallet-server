import {DataTypes, Model} from 'sequelize';
import {QuestionStatus, QuestionTypes} from '../util/enums';

import dbconnection from '../util/dbconnection';

export interface QuestionAttributes {
	id?: number;
	totalBounty?: unknown;
	content: string;
	rawContentLanguage: string;
	rawContent: string;
	userId: number;
	bountyAmount: number;
	status?: QuestionStatus;
	type?: QuestionTypes;
	currentMedication?: string;
	ageSexEthnicity?: string;
	pastIllnessHistory?: string;
	others?: string;
}
export class Question extends Model<QuestionAttributes> {
	declare id: number;
	declare content: string;
	declare rawContentLanguage: string;
	declare rawContent: string;
	declare userId: number;
	declare bountyAmount: number;
	declare status: QuestionStatus;
	declare type: QuestionTypes;
	declare dataValues: QuestionAttributes;
	declare currentMedication?: string;
	declare ageSexEthnicity?: string;
	declare pastIllnessHistory?: string;
	declare others?: string;
	declare createdAt?: Date;
	declare updatedAt?: Date;

	static associate(models: any) {
		// define association here
	}
}

Question.init(
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
		rawContentLanguage: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		rawContent: {
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
			type: DataTypes.ENUM(...Object.values(QuestionStatus)),
			allowNull: false,
			defaultValue: QuestionStatus.OPEN,
		},
		type: {
			type: DataTypes.ENUM(...Object.values(QuestionTypes)),
			allowNull: false,
			defaultValue: QuestionTypes.GENERAL,
		},
		currentMedication: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		ageSexEthnicity: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		pastIllnessHistory: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		others: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'questions',
		timestamps: true,
		paranoid: true,
		underscored: true,
	},
);
