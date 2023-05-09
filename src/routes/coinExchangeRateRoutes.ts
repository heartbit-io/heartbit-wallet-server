import CoinExchangeRateController from '../controllers/CoinExchangeRateController';
import {Router} from 'express';

const router = Router();

router.get('/btc', CoinExchangeRateController.getBtcExchangeRate);

export {router as coinExchangeRateRoutes};
