import {Router} from 'express';
import {questionRoutes} from './questionRoutes';
import {replyRoutes} from './replyRoutes';
import {userRoutes} from './userRoutes';
import {transactionRoutes} from './transactionRoutes';
import swaggerUi from 'swagger-ui-express';
import { apiDocumentation } from '../docs/apidoc';
import Auth from '../middleware/Auth';
import { doctorRoutes } from './doctorRoutes';

const router = Router();

router.use('/questions', Auth.verifyToken, questionRoutes);
router.use('/replies', Auth.verifyToken, replyRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/transactions', Auth.verifyToken, transactionRoutes);
router.use('/documentation', swaggerUi.serve, swaggerUi.setup(apiDocumentation));

export {router as routes};
