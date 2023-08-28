import {User, UserAttributes} from '../domains/entities/User';
import dataSource, {userDataSource} from '../domains/repo';

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

	async createUser(user: UserAttributes) {
		return await userDataSource.save({...user});
	}

	async getUserBalance(id: number) {
		return await userDataSource.findOne({
			where: {id},
			select: {btcBalance: true},
		});
	}

	async updateUserBtcBalance(btcBalance: number, id: number) {
		return await dataSource
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

	async updateUserFcmToken(fcmToken: string, email: string) {
		return await dataSource
			.createQueryBuilder()
			.update(User)
			.set({fcmToken})
			.where('email = :email', {email})
			.execute();
	}

	async deleteUserFcmToken(email: string) {
		return await dataSource
			.createQueryBuilder()
			.update(User)
			.set({fcmToken: null})
			.where('email = :email', {email})
			.execute();
	}

	async getUserTotalBalance(id: number): Promise<User | null> {
		return await userDataSource.findOne({
			where: {id},
			select: {btcBalance: true, promotionBtcBalance: true},
		});
	}

	async updateUserPromotionBtcBalance(promotionBtcBalance: number, id: number) {
		return await dataSource
			.createQueryBuilder()
			.update(User)
			.set({promotionBtcBalance})
			.where('id = :id', {id})
			.execute();
	}

	async deleteUserAccount(id: number) {
		return await userDataSource
			.createQueryBuilder()
			.softDelete()
			.where('id = :id', {id})
			.execute();
	}
}

export default new UserRepository();
