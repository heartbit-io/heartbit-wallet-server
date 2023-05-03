import RepliesController from '../controllers/RepliesController';
import RepliesValidator from '../lib/RepliesValidator';
import {Router} from 'express';
import Validation from '../middleware/Validation';

const router = Router();

router.get('/:questionId/reply', RepliesController.get);

router.post('/:questionId/chatGptReply', RepliesController.createChatGPTReply);

router.delete(
	'/:replyId',
	RepliesValidator.checkDeleteReply(),
	Validation.validate,
	RepliesController.delete,
);

export {router as replyRoutes};
