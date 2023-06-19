import {CreationOptional, DataTypes, Model} from 'sequelize';

import {ReplyStatus} from '../util/enums';
import dbconnection from '../util/dbconnection';

export interface RepliesAttributes {
	id?: number;
	questionId: number;
	userId: number;
	title: string;
	content: string;
	status: ReplyStatus;
	majorComplaint: string;
	medicalHistory: string;
	currentMedications: string;
	assessment: string;
	plan: string;
	triage: string;
	doctorNote: string;
}

export class Reply extends Model<RepliesAttributes> {
	declare id: number;
	declare questionId: CreationOptional<number>;
	declare title: string;
	declare content: string;
	declare status: ReplyStatus;
	declare userId: number;
	declare bountyAmount: number;
	declare majorComplaint: string;
	declare medicalHistory: string;
	declare currentMedications: string;
	declare assessment: string;
	declare plan: string;
	declare triage: string;
	declare doctorNote: string;
	declare createdAt: Date;
	declare updatedAt: Date;

	static associate(models: any) {
		// define association here
		Reply.belongsTo(models.questions, {
			targetKey: 'id',
			foreignKey: 'questionId',
		});
	}
}

Reply.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		majorComplaint: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		medicalHistory: {
			type: DataTypes.TEXT,
		},
		currentMedications: {
			type: DataTypes.TEXT,
		},
		assessment: {
			type: DataTypes.TEXT,
		},
		plan: {
			type: DataTypes.TEXT,
		},
		triage: {
			type: DataTypes.TEXT,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(ReplyStatus)),
			allowNull: false,
			defaultValue: ReplyStatus.DRAFT,
		},
		doctorNote: {
			type: DataTypes.TEXT,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		questionId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize: dbconnection,
		tableName: 'replies',
		timestamps: true,
		paranoid: true,
		underscored: true,
	},
);
