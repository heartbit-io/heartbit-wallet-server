import {Router} from 'express';
import UsersValidator from '../lib/UsersValidator';
import Validation from '../middleware/Validation';
import UsersController from '../controllers/UsersController';
import Auth from '../middleware/Auth';

const router = Router();

router.post(
	'/',
	UsersValidator.userCreate(),
	Validation.validate,
	UsersController.create,
);

router.get('/:pubkey', Auth.verifyToken, UsersController.getUser);

export {router as userRoutes};
