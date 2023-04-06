import { DataTypes, Model } from 'sequelize';
import dbconnection from '../util/dbconnection';

interface UserAttributes {
	id?: number;
	pubkey: string;
	role: string;
	btc_balance: number;
}
export class UserInstance extends Model<UserAttributes> {

  declare pubkey: string;

  declare role: string;

  declare btc_balance: number;
}

UserInstance.init(
  {
    pubkey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    btc_balance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    }
  },
  {
    sequelize: dbconnection,
    tableName: 'users',
    timestamps: true,
  },
);
