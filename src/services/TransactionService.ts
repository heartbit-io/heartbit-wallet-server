import { TransactionInstance } from "../models/TransactionModel";
import { Op } from 'sequelize';


class TransactionService {
    
    async getUserTransactions(user_pubkey: string): Promise<TransactionInstance[]> {
        return await TransactionInstance.findAll({
            where: { [Op.or]: [ { from_user_pubkey: user_pubkey}, { to_user_pubkey: user_pubkey} ]},
        });

    }
}

export default new TransactionService;
