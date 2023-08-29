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
router.patch(
	'/fcmtoken/update',
	Auth.verifyToken,
	UsersController.updateFcmToken,
);
router.get('/:email', Auth.verifyToken, UsersController.getUser);
router.patch(
	'/fcmtoken/delete',
	Auth.verifyToken,
	UsersController.deleteFcmToken,
);
router.delete(
	'/:id',
	Auth.verifyToken,
	UsersValidator.deleteUserAccount(),
	Validation.validate,
	UsersController.deleteUserAccount,
);

export {router as userRoutes};
