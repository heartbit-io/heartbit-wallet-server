import Auth from '../middleware/Auth';
import {Router} from 'express';
import UsersController from '../controllers/UsersController';
import UsersValidator from '../lib/UsersValidator';
import Validation from '../middleware/Validation';

const router = Router();

router.get('/login', UsersController.login);
router.post(
	'/',
	UsersValidator.userCreate(),
	Validation.validate,
	UsersController.create,
);

router.get('/me', Auth.verifyToken, UsersController.getUser);
router.get('/:email', Auth.verifyToken, UsersController.getUser);

export {router as userRoutes};
