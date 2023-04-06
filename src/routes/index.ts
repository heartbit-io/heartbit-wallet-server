import {Router} from 'express';
import { questionRoutes } from './questionRoutes';
import { replyRoutes } from './replyRoutes';
import { userRoutes } from './userRoutes';
import { transactionRoutes } from './transactionRoutes';

const router = Router();

router.use('/questions', questionRoutes);
router.use('/replies', replyRoutes);
router.use('/users/', userRoutes);
router.use('/transactions', transactionRoutes);

export { router as routes };
