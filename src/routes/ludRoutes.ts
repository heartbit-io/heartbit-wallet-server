import {Router} from 'express';
import PaymentsController from '../controllers/PaymentsController';
import PaymentsValidator from '../lib/PaymentsValidator';
import Validation from '../middleware/Validation';

const router = Router();

router.get(
	'/withdrawals',
	PaymentsValidator.validateSecret(),
	Validation.validate,
	PaymentsController.getWithdrawalInfo,
);

router.get(
	'/withdrawals/payments',
	PaymentsValidator.validateSecretAndInvoice(),
	Validation.validate,
	PaymentsController.payWithdrawalInvoice,
);

export {router as ludRoutes};
