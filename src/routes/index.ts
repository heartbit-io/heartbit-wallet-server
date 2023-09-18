import Auth from '../middleware/Auth';
import {Router} from 'express';
import {apiDocumentation} from '../docs/apidoc';
import {coinExchangeRateRoutes} from './coinExchangeRateRoutes';
import {doctorRoutes} from './doctorRoutes';
import {questionRoutes} from './questionRoutes';
import {replyRoutes} from './replyRoutes';
import swaggerUi from 'swagger-ui-express';
import {transactionRoutes} from './transactionRoutes';
import {userRoutes} from './userRoutes';
import FBUtil from '../util/FBUtil';
import {ludRoutes} from './ludRoutes';
import {healthcheck} from './healthcheck';
import {lndRoutes} from './lndRoutes';

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
router.use('/coin-exchange-rates', Auth.verifyToken, coinExchangeRateRoutes);

//lightning server
router.use('/lnd', FBUtil.verifyKeyAndToken, lndRoutes);
router.use('/lnurl', ludRoutes);
router.use('/healthcheck', healthcheck);

export {router as routes};
