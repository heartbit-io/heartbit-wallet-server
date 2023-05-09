import CoinExchageRateController from '../controllers/CoinExchageRateController';
import {Router} from 'express';

const router = Router();

router.get('/btc', CoinExchageRateController.getBtcExchageRate);

export {router as coinExchageRateRoutes};
