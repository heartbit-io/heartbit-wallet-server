import RepliesController from '../controllers/RepliesController';
import RepliesValidator from '../lib/RepliesValidator';
import DoctorsController from '../controllers/DoctorsController';
import {Router} from 'express';
import Validation from '../middleware/Validation';

const router = Router();

router.post(
	'/',
	RepliesValidator.checkCreateReply(),
	Validation.validate,
	DoctorsController.createDoctorReply,
);

router.delete(
	'/:replyId',
	RepliesValidator.checkDeleteReply(),
	Validation.validate,
	RepliesController.delete,
);

export {router as replyRoutes};
