import {User, UserAttributes} from '../domains/entities/User';

import {userDataSource} from '../domains/repo';

class UserRepository {
	async getUserDetailsById(id: number) {
		return await userDataSource.findOne({where: {id}});
	}

	async getUserDetailsByEmail(email: string) {
		return await userDataSource.findOne({where: {email}});
	}

	async getUserDetailsByPubkey(pubkey: string) {
		return await userDataSource.findOne({where: {pubkey}});
	}

	async createUser(user: UserAttributes, dbTransaction?: any) {
		return await userDataSource.save({...user}, {transaction: dbTransaction});
	}

	async getUserBalance(id: number) {
		return await userDataSource.findOne({
			where: {id},
			select: {btcBalance: true},
		});
	}

	async updateUserBtcBalance(btcBalance: number, id: number) {
		// return await User.update({btcBalance}, {where: {id}});
		return await userDataSource
			.createQueryBuilder()
			.update(User)
			.set({btcBalance})
			.where('id = :id', {id})
			.execute();
	}

	async getUserFcmToken(id: number): Promise<User | null> {
		return await userDataSource.findOne({
			where: {id},
			select: {fcmToken: true},
		});
	}
}

export default new UserRepository();
