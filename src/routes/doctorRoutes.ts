import DoctorsController from '../controllers/DoctorsController';
import RepliesValidator from '../lib/RepliesValidator';
import {Router} from 'express';
import Validation from '../middleware/Validation';

const router = Router();

router.get('/questions', DoctorsController.getQuestions);
router.get('/questions/:questionId', DoctorsController.getQuestion);
router.get('/answered-questions', DoctorsController.getDoctorAnsweredQuestions);
// router.get('/replies/:replyId', DoctorsController.getReply);

export {router as doctorRoutes};
