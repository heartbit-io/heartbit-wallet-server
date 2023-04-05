import { DataTypes, Model } from 'sequelize';
import dbconnection from '../util/dbconnection';

interface RepliesAttributes {
	id?: number;
	post_id: number;
	user_pubkey: string;
	content: string;
	best_reply: boolean;
}
export class ReplyInstance extends Model<RepliesAttributes> {
  declare post_id: number;

  declare content: string;

  declare user_pubkey: string;

  declare best_reply: boolean;
}

ReplyInstance.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    user_pubkey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    post_id: {
      type: DataTypes.NUMBER,
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
  },
);
