import RepliesController from '../controllers/RepliesController';
import RepliesValidator from '../lib/RepliesValidator';
import {Router} from 'express';
import Validation from '../middleware/Validation';

const router = Router();

router.post(
	'/',
	RepliesValidator.checkCreateReply(),
	Validation.validate,
	RepliesController.create,
);

router.delete(
	'/:replyId',
	RepliesValidator.checkDeleteReply(),
	Validation.validate,
	RepliesController.delete,
);

router.patch('/:replyId', RepliesController.markAsBestReply);

export {router as replyRoutes};
