import {UserAttributes, User} from '../models/UserModel';

class UserService {
	async getUserDetailsById(id: number): Promise<User | null> {
		return await User.findOne({where: {id}});
	}

	async getUserDetailsByEmail(email: string): Promise<User | null> {
		return await User.findOne({where: {email}});
	}

	async getUserDetailsByPubkey(pubkey: string): Promise<User | null> {
		return await User.findOne({where: {pubkey}});
	}

	async createUser(user: UserAttributes, dbTransaction?: any) {
		return await User.create({...user}, {transaction: dbTransaction});
	}

	async getUserBalance(id: number): Promise<User | null> {
		return await User.findOne({
			where: {id},
			attributes: ['btcBalance'],
			plain: true,
		});
	}

	async updateUserBtcBalance(btcBalance: number, id: number) {
		return await User.update({btcBalance}, {where: {id}});
	}
}

export default new UserService();
