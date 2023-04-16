import { TransactionInstance } from "../models/TransactionModel";

class TransactionService {
    
    async getUserTransactions(from_user_pubkey: string): Promise<TransactionInstance[]> {
        return await TransactionInstance.findAll({where: {from_user_pubkey}})
    }
}

export default new TransactionService;
