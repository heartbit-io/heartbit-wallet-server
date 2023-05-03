import {Router} from 'express';
import Validation from '../middleware/Validation';
import RepliesValidator from '../lib/RepliesValidator';
import DoctorsController from '../controllers/DoctorsController';

const router = Router();

router.post(
	'/replies/',
	RepliesValidator.checkCreateReply(),
	Validation.validate,
	DoctorsController.createDoctorReply,
);

router.get('/questions', DoctorsController.getQuestions);


export {router as doctorRoutes};
