import {Router} from 'express';
import {questionRoutes} from './questionRoutes';
import {replyRoutes} from './replyRoutes';
import {userRoutes} from './userRoutes';
import {transactionRoutes} from './transactionRoutes';
import swaggerUi from 'swagger-ui-express';
import { apiDocumentation } from '../docs/apidoc';

const router = Router();

router.use('/questions', questionRoutes);
router.use('/replies', replyRoutes);
router.use('/users/', userRoutes);
router.use('/transactions', transactionRoutes);
router.use('/documentation', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

export {router as routes};
