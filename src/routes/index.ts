import Auth from '../middleware/Auth';
import {Router} from 'express';
import {apiDocumentation} from '../docs/apidoc';
import {coinExchageRateRoutes} from './coinExchageRateRoutes';
import {doctorRoutes} from './doctorRoutes';
import {questionRoutes} from './questionRoutes';
import {replyRoutes} from './replyRoutes';
import swaggerUi from 'swagger-ui-express';
import {transactionRoutes} from './transactionRoutes';
import {userRoutes} from './userRoutes';

const router = Router();

router.use('/questions', Auth.verifyToken, questionRoutes);
router.use('/replies', Auth.verifyToken, replyRoutes);
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/transactions', Auth.verifyToken, transactionRoutes);
router.use(
	'/documentation',
	swaggerUi.serve,
	swaggerUi.setup(apiDocumentation),
);
router.use('/coinExchageRate', Auth.verifyToken, coinExchageRateRoutes);

export {router as routes};
