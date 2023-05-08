import {UserAttributes, UserInstance} from '../models/UserModel';

class UserService {
	async getUserDetailsById(id: number): Promise<UserInstance | null> {
		return await UserInstance.findOne({where: {id}});
	}

	async getUserDetailsByEmail(email: string): Promise<UserInstance | null> {
		return await UserInstance.findOne({where: {email}});
	}

	async getUserDetailsByPubkey(pubkey: string): Promise<UserInstance | null> {
		return await UserInstance.findOne({where: {pubkey}});
	}

	async createUser(user: UserAttributes, dbTransaction?: any) {
		return await UserInstance.create({...user}, {transaction: dbTransaction});
	}

	async getUserBalance(id: number): Promise<UserInstance | null> {
		return await UserInstance.findOne({
			where: {id},
			attributes: ['btcBalance'],
			plain: true,
		});
	}

	async updateUserBtcBalance(btcBalance: number, id: number) {
		return await UserInstance.update({btcBalance}, {where: {id}});
	}
}

export default new UserService();
