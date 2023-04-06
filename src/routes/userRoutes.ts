import {Router} from 'express';
import UsersValidator from '../lib/UsersValidator';
import Validation from '../middleware/Validation';
import UsersController from '../controllers/UsersController';

const router = Router();

router.post(
	'/',
	UsersValidator.userCreate(),
	Validation.validate,
	UsersController.create,
);

router.get('/:pubkey', UsersController.getUser);

export {router as userRoutes};
