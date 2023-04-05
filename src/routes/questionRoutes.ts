import {Router} from 'express';
import QuestionsValidator from '../lib/QuestionsValidator';
import Validation from '../middleware/Validation';
import QuestionsController from '../controllers/QuestionsController';
import { uploadFile } from '../middleware/upload';

const router = Router();

router.post(
  '/',
  uploadFile.single('image'),
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

router.patch(
	'/:questionId',
	QuestionsValidator.checkQuestion(),
	Validation.validate,
	QuestionsController.updateQuestion,
);

router.delete(
	'/:questionId',
	QuestionsValidator.checkQuestion(),
	Validation.validate,
	QuestionsController.delete,
);

export {router as questionRoutes};
