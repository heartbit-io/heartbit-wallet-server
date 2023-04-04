import { DataTypes, Model } from "sequelize";
import dbconnection from "../util/dbconnection";

enum QuesstionStatus {
    Open = "Open",
    Closed = "Closed",
}

interface QuestionAttributes {
    id?:number,
    title: string;
    content: string;
    pubkey: string;
    bounty_amount: number;
    image?: string;
    status?: QuesstionStatus,
}
export class QuestionInstance extends Model<QuestionAttributes> {
    declare title: string;
    declare content: string;
    declare pubkey: string;
    declare bounty_amount: number;
    declare image: string | null;
    declare status: string;
}

QuestionInstance.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
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
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Open', 'Closed'),
        allowNull: false,
        defaultValue: 'Open',
    },

}, {
    sequelize: dbconnection,
    tableName: "questions",
    timestamps: true,
});


 

