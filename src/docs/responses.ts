const internalError = {
	type: 'object',
	properties: {
		success: {
			type: 'boolean',
			example: false,
		},
		statusCode: {
			type: 'number',
			example: 500,
		},
		message: {
			type: 'string',
			example: 'Internal Server Error',
		},
		data: {
			type: 'string',
			example: null,
		},
	},
};

const notFoundError = {
	type: 'object',
	properties: {
		success: {
			type: 'boolean',
			example: false,
		},
		statusCode: {
			type: 'number',
			example: 404,
		},
		message: {
			type: 'string',
			example: 'Not Found Error',
		},
		data: {
			type: 'string',
			example: null,
		},
	},
};

const unprocessedContentError = {
	type: 'object',
	properties: {
		success: {
			type: 'boolean',
			example: false,
		},
		statusCode: {
			type: 'number',
			example: 422,
		},
		message: {
			type: 'string',
			example: 'Unprocessed Content Error',
		},
		data: {
			type: 'string',
			example: null,
		},
	},
};

export {internalError, notFoundError, unprocessedContentError};
