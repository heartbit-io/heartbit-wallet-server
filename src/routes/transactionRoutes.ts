import {Router} from 'express';
import TransactionsController from '../controllers/TransactionsController';
import TransactionsValidator from '../lib/TransactionsValidator';
import Validation from '../middleware/Validation';

const router = Router();

router.get(
	'/:pubkey',
	TransactionsValidator.user(),
	Validation.validate,
	TransactionsController.getUserTransactions,
);

export {router as transactionRoutes};
