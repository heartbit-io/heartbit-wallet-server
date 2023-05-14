import DoctorsController from '../controllers/DoctorsController';
import RepliesValidator from '../lib/RepliesValidator';
import {Router} from 'express';
import Validation from '../middleware/Validation';
import DoctorAuth from '../middleware/DoctorAuth';

const router = Router();

router.get('/portal', DoctorsController.portal);
router.get('/login', DoctorsController.login);
router.get(
	'/questions',
	DoctorAuth.verifyToken,
	DoctorsController.getQuestions,
);
router.get(
	'/questions/:questionId',
	DoctorAuth.verifyToken,
	DoctorsController.getQuestion,
);
router.get(
	'/answered-questions',
	DoctorAuth.verifyToken,
	DoctorsController.getDoctorAnsweredQuestions,
);
router.get(
	'/answered-questions/:questionId',
	DoctorsController.getDoctorAnsweredQuestion,
);

export {router as doctorRoutes};
