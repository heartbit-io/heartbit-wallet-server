import {Router} from 'express';
import RepliesController from '../controllers/RepliesController';

const router = Router();

router.post('/', RepliesController.create);

router.delete('/:replyId', RepliesController.delete);

router.patch('/:replyId', RepliesController.markAsBestReply);

export {router as replyRoutes};
