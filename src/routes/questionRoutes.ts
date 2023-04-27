import QuestionsController from '../controllers/QuestionsController';
import QuestionsValidator from '../lib/QuestionsValidator';
import RepliesController from '../controllers/RepliesController';
import {Router} from 'express';
import Validation from '../middleware/Validation';
const router = Router();

router.get('/:questionId/reply', Validation.validate, RepliesController.get);

router.get(
	'/:questionId/chatGptReply',
	Validation.validate,
	RepliesController.getChatgptReply,
);

router.post(
	'/',
	QuestionsValidator.checkCreateQuestion(),
	Validation.validate,
	QuestionsController.create,
);

router.get(
	'/',
	QuestionsValidator.getAllQuestions(),
	Validation.validate,
	QuestionsController.getAllQuestions,
);
router.get('/open', QuestionsController.getOpenQuestionsOrderByBounty);
router.get(
	'/status',
	QuestionsValidator.getUserQuestionsBystatus(),
	Validation.validate,
	QuestionsController.getUserQuestionsByStatus,
);
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
