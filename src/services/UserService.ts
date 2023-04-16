import {UserAttributes, UserInstance} from '../models/UserModel';

class UserService {
	async getUserDetails(pubkey: string): Promise<UserInstance | null> {
		return await UserInstance.findOne({where: {pubkey}});
    }
    
    async createUser(user: UserAttributes) {
        return await UserInstance.create({ ...user});
    }

	async getUserBalance(pubkey: string): Promise<UserInstance | null> {
		return await UserInstance.findOne({
			where: {pubkey},
			attributes: ['btc_balance'],
			plain: true,
		});
	}
}

export default new UserService();
