import Auth from '../middleware/Auth';
import DoctorsController from '../controllers/DoctorsController';
import DoctorsValidator from '../lib/DoctorsValidator';
import {Router} from 'express';
import Validation from '../middleware/Validation';

const router = Router();

router.get('/portal', DoctorsController.portal);
router.get('/login', Auth.verifyToken, DoctorsController.login);
router.get(
	'/questions',
	Auth.verifyToken,
	DoctorsValidator.getQuestion(),
	Validation.validate,
	DoctorsController.getQuestions,
);
router.get(
	'/questions/:questionId',
	Auth.verifyToken,
	DoctorsController.getQuestion,
);
router.get(
	'/answered-questions',
	Auth.verifyToken,
	DoctorsController.getDoctorAnsweredQuestions,
);
router.get(
	'/answered-questions/:questionId',
	Auth.verifyToken,
	DoctorsController.getDoctorAnsweredQuestion,
);

router.post(
	'/assign-question',
	Auth.verifyToken,
	DoctorsController.assignQuestion,
);
router.post(
	'/remove-question',
	Auth.verifyToken,
	DoctorsController.removeQuestion,
);
export {router as doctorRoutes};
