import {HttpCodes} from '../util/HttpCodes';

class FormatResponse {
	success: boolean;

	status_code: HttpCodes;

	message: string;

	data: null | object;

	constructor(
		success: boolean,
		statusCode: HttpCodes,
		message: string | any,
		data: object | null,
	) {
		this.success = success;
		this.status_code = statusCode;
		this.message = message;
		this.data = data;
	}
}

export default FormatResponse;
