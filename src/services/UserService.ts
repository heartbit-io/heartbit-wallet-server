import {UserAttributes, UserInstance} from '../models/UserModel';

class UserService {
	async getUserDetails(email: string): Promise<UserInstance | null> {
		return await UserInstance.findOne({where: {email}});
	}

	async createUser(user: UserAttributes) {
		return await UserInstance.create({...user});
	}

	async getUserBalance(email: string): Promise<UserInstance | null> {
		return await UserInstance.findOne({
			where: {email},
			attributes: ['btc_balance'],
			plain: true,
		});
	}

	async updateUserBtcBalance(btc_balance: number, email: string) {
		return await UserInstance.update(
			{btc_balance},
			{
				where: {
					email,
				},
			},
		);
	}
}

export default new UserService();
