import {Router} from 'express';
import PaymentsController from '../controllers/PaymentsController';
import PaymentsValidator from '../lib/PaymentsValidator';
import Validation from '../middleware/Validation';

const router = Router();

router.get(
	'/deposits',
	PaymentsValidator.validateEmaliAndAmount(),
	Validation.validate,
	PaymentsController.getPaymentRequest,
);

router.get(
	'/withdrawals',
	PaymentsValidator.validateEmaliAndAmount(),
	Validation.validate,
	PaymentsController.getWithdrawalRequest,
);

export {router as lndRoutes};
