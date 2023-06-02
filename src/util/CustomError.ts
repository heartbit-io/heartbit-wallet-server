import {HttpCodes} from './HttpCodes';

export class CustomError {
	code: HttpCodes;
	message: string;

	constructor(code: HttpCodes, message: string) {
		this.code = code;
		this.message = message;
	}
}
