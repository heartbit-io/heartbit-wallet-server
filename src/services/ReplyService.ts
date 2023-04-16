import {ReplyInstance} from '../models/ReplyModel';

class ReplyService {
	async getUserReplies(user_pubkey: string) {
		return await ReplyInstance.findAll({where: {user_pubkey}});
	}
}


export default new ReplyService;
