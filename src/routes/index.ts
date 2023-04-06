import {Router} from 'express';
import { questionRoutes } from './questionRoutes';
import { replyRoutes } from './replyRoutes';

const router = Router();

router.use('/api/v1/questions', questionRoutes);
router.use('/api/v1/replies', replyRoutes);

export { router as routes };
