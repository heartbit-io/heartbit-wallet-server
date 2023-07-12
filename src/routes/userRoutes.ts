import Auth from '../middleware/Auth';
import {Router} from 'express';
import UsersController from '../controllers/UsersController';
import UsersValidator from '../lib/UsersValidator';
import Validation from '../middleware/Validation';

const router = Router();

router.post(
	'/',
	Auth.verifyApiKey,
	UsersValidator.userCreate(),
	Validation.validate,
	UsersController.create,
);
router.patch('/fcmtoken', Auth.verifyToken, UsersController.updateFcmToken);
router.get('/:email', Auth.verifyToken, UsersController.getUser);

export {router as userRoutes};
