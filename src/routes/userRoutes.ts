import {Router} from 'express';
import UsersValidator from '../lib/UsersValidator';
import Validation from '../middleware/Validation';
import UsersController from '../controllers/UsersController';
import Auth from '../middleware/Auth';

const router = Router();

router.post('/login', UsersController.login);
router.post(
	'/',
	UsersValidator.userCreate(),
	Validation.validate,
	UsersController.create,
);

router.get('/me', UsersController.getUser);
router.get('/:email', UsersController.getUser);

export {router as userRoutes};
