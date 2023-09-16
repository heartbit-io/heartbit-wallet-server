import express from 'express';
import {HttpCodes} from '../util/HttpCodes';
import ResponseDto from '../dto/ResponseDTO';

const router = express.Router();

router.get('/', async (_req, res) => {
	const healthcheck = {
		uptime: process.uptime(),
		message: 'Lightning Wallet API is up and running',
		timestamp: Date.now(),
	};
	try {
		return res
			.status(HttpCodes.OK)
			.json(
				new ResponseDto(true, HttpCodes.OK, 'Service available', healthcheck),
			);
	} catch (error) {
		res
			.status(HttpCodes.SERVICE_UNAVAILABLE)
			.json(new ResponseDto(false, HttpCodes.SERVICE_UNAVAILABLE, error, null));
	}
});

export {router as healthcheck};
