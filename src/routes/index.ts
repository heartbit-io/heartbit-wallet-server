import {Router} from 'express';
import { questionRoutes } from './questionRoutes';

const router = Router();

router.use('/api/v1/questions', questionRoutes);

export { router as routes };
