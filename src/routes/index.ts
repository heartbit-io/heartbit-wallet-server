import {Router} from 'express';
import { questionRoutes } from './questionRoutes';
import { replyRoutes } from './replyRoutes';
import { userRoutes } from './userRoutes';

const router = Router();

router.use('/api/v1/questions', questionRoutes);
router.use('/api/v1/replies', replyRoutes);
router.use('/api/v1/users/', userRoutes)

export { router as routes };
