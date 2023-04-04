import { Router } from 'express';
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

router.delete(
  '/:questionId',
  QuestionsValidator.checkDelete(),
  Validation.validate,
  QuestionsController.delete,
);

export { router as questionRoutes };
