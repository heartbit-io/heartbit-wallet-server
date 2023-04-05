import { DataTypes, Model } from 'sequelize';
import dbconnection from '../util/dbconnection';

enum QuesstionStatus {
	Open = 'Open',
	Closed = 'Closed'
}

interface QuestionAttributes {
	id?: number;
	content: string;
	pubkey: string;
	bounty_amount: number;
	status?: QuesstionStatus;
}
export class QuestionInstance extends Model<QuestionAttributes> {
  declare content: string;

  declare pubkey: string;

  declare bounty_amount: number;

  declare status: string;
}

QuestionInstance.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pubkey: {
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
  },
);
