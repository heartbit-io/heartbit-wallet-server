import {CreationOptional, DataTypes, Model} from 'sequelize';

import {ReplyStatus} from '../util/enums';
import dbconnection from '../util/dbconnection';

export interface RepliesAttributes {
	id?: number;
	questionId: number;
	userId: number;
	content: string;
	status: ReplyStatus;
}

export class ReplyInstance extends Model<RepliesAttributes> {
	declare questionId: CreationOptional<number>;
	declare content: string;
	declare status: ReplyStatus;
	declare userId: number;
	declare bountyAmount: number;
	declare createdAt: Date;
	declare updatedAt: Date;

	static associate(models: any) {
		// define association here
		ReplyInstance.belongsTo(models.questions, {
			targetKey: 'id',
			foreignKey: 'questionId',
		});
	}
}

ReplyInstance.init(
	{
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM(...Object.values(ReplyStatus)),
			allowNull: false,
			defaultValue: ReplyStatus.DRAFT,
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
	},
);
