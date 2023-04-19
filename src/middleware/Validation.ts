import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import FormatResponse from '../lib/FormatResponse';
import {HttpCodes} from '../util/HttpCodes';

class Validation {
	validate(req: Request, res: Response, next: NextFunction) {
		const error = validationResult(req);
		if (!error.isEmpty()) {
			return res
				.status(HttpCodes.BAD_REQUEST)
				.json(
					new FormatResponse(
						false,
						HttpCodes.BAD_REQUEST,
						error.array(),
						null,
					),
				);
		}
		next();
	}
}
export default new Validation();
