import RepliesController from '../controllers/RepliesController';
import RepliesValidator from '../lib/RepliesValidator';
import {Router} from 'express';
import Validation from '../middleware/Validation';

const router = Router();

router.get('/:questionId/reply', RepliesController.get);

router.get('/:questionId/chatGptReply', RepliesController.createChatGPTReply);

router.post(
	'/',
	RepliesValidator.checkCreateReply(),
	Validation.validate,
	RepliesController.createDoctorReply,
);

router.delete(
	'/:replyId',
	RepliesValidator.checkDeleteReply(),
	Validation.validate,
	RepliesController.delete,
);

export {router as replyRoutes};
