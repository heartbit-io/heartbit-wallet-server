import {Sequelize} from 'sequelize';
import { UserInstance } from '../models/UserModel';

class UserService {

    async getUserBalance(pubkey: string) {
        return await UserInstance.findOne({ where: { pubkey }, attributes: ['btc_balance'], plain: true });
    }
}


export default new UserService;
