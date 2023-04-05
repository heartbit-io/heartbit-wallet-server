import {Router} from 'express';
import QuestionsValidator from '../lib/QuestionsValidator';
import Validation from '../middleware/Validation';
import QuestionsController from '../controllers/QuestionsController';

const router = Router();

router.post(
  '/',
	QuestionsValidator.checkCreateQuestion(),
	Validation.validate,
	QuestionsController.create,
);

router.get('/', QuestionsController.getAllQuestions);
router.get(
	'/:questionId',
	QuestionsValidator.checkQuestion(),
	Validation.validate,
	QuestionsController.getQuestion,
);


router.delete(
	'/:questionId',
	QuestionsValidator.checkQuestion(),
	Validation.validate,
	QuestionsController.delete,
);

export {router as questionRoutes};
