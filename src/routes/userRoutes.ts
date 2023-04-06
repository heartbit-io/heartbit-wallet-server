import {Router} from 'express';
import RepliesController from '../controllers/UsersController';
import UsersValidator from '../lib/UsersValidator';
import Validation from '../middleware/Validation';

const router = Router();

router.post(
	'/',
	UsersValidator.userCreate(),
	Validation.validate,
	RepliesController.create,
);

// router.delete('/:replyId', RepliesController.delete);

// router.patch('/:replyId', RepliesController.update);

export {router as userRoutes};
