const getReply = {
	tags: ['Replies'],
	description: 'Get a reply by question id',
	operationId: 'getReply',
	parameters: [
		{
			name: 'questionId',
			in: 'path',
			description: 'The id of the question',
			required: true,
			schema: {
				type: 'number',
			},
		},
	],
	responses: {
		'200': {
			description: 'Reply retrieved successfully',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: true,
							},
							statusCode: {
								type: 'number',
								example: 200,
							},
							message: {
								type: 'string',
								example: 'Reply retrieved successfully',
							},
							data: {
								type: 'object',
								properties: {
									replyType: {
										type: 'string',
										example: 'DOCTOR',
									},
									name: {
										type: 'string',
										example: 'Dr. John Doe',
									},
									classification: {
										type: 'string',
										example: 'General physician',
									},
									reply: {
										type: 'string',
										example: 'This is a reply',
									},
									updatedAt: {
										type: 'string',
										example: '2021-08-01T00:00:00.000Z',
									},
								},
							},
						},
					},
				},
			},
		},
		'404': {
			description: 'Reply not found',
			content: {
				'application/json': {
					schema: {},
				},
			},
		},
		'500': {
			description: 'Internal server error',
			content: {
				'application/json': {
					schema: {},
				},
			},
		},
	},
};

const getChatgptReply = {
	tags: ['Replies'],
	description: 'Get a reply from chatgpt',
	operationId: 'getChatgptReply',
	parameters: [
		{
			name: 'questionId',
			in: 'path',
			description: 'The id of the question',
			required: true,
			schema: {
				type: 'number',
			},
		},
		{
			name: 'questionContent',
			in: 'query',
			description: 'The content of the question',
			required: true,
			schema: {
				type: 'string',
			},
		},
	],
	responses: {
		'200': {
			description: 'Reply from ChatGPT retrieved successfully',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: true,
							},
							statusCode: {
								type: 'number',
								example: 200,
							},
							message: {
								type: 'string',
								example: 'ChatGPT Reply retrieved successfully',
							},
							data: {
								type: 'object',
								properties: {
									reply: {
										type: 'string',
										example: 'This is a reply',
									},
								},
							},
						},
					},
				},
			},
		},
		'404': {
			description: 'ChatGPT Reply not found',
			content: {
				'application/json': {
					schema: {},
				},
			},
		},
		'500': {
			description: 'Internal server error',
			content: {
				'application/json': {
					schema: {},
				},
			},
		},
	},
};

const createReply = {
	tags: ['Replies'],
	description: 'Create a reply to a question',
	operationId: 'createReply',
	requestBody: {
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/createReplyBody',
				},
			},
		},
		required: true,
	},
	responses: {
		'201': {
			description: 'Reply to a question',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: true,
							},
							statusCode: {
								type: 'number',
								example: 201,
							},
							message: {
								type: 'string',
								example: 'Reply created successfully',
							},
							data: {
								type: 'object',
								properties: {
									best_reply: {
										type: 'boolean',
										example: false,
									},
									id: {
										type: 'number',
										example: 12,
									},
									question_id: {
										type: 'number',
										example: 51,
									},
									user_email: {
										type: 'string',
										example: 'david@heartbit.io',
									},
									content: {
										type: 'string',
										example: 'this is the reply to a post',
									},
									updatedAt: {
										type: 'string',
										example: '2023-04-12T21:36:10.115Z',
									},
									createdAt: {
										type: 'string',
										example: '2023-04-12T21:36:10.115Z',
									},
								},
							},
						},
					},
				},
			},
		},
		'400': {
			description: 'Validation error creating a reply',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: false,
							},
							statusCode: {
								type: 'number',
								example: 400,
							},
							message: {
								type: 'object',
								properties: {
									value: {
										type: 'number',
										example: 99,
									},
									msg: {type: 'string', example: 'Question does not exist'},
									param: {type: 'string', example: 'question_id'},
									location: {type: 'string', example: 'body'},
								},
							},
							data: null,
						},
					},
				},
			},
		},
		'500': {
			description: 'Internal Server Error',
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/internalError',
					},
				},
			},
		},
	},
};

const deleteReply = {
	tags: ['Replies'],
	description: 'Delete given reply',
	operationId: 'deleteReply',
	parameters: [
		{
			name: 'id',
			in: 'path',
			description: 'Reply id',
			required: true,
			type: 'number',
		},
	],
	requestBody: {
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/pubkeyRequestBody',
				},
			},
		},
		required: true,
	},
	responses: {
		'200': {
			description: 'Successfully deleted reply',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: true,
							},
							statusCode: {
								type: 'number',
								example: 200,
							},
							message: {
								type: 'string',
								example: 'Successfully deleted reply',
							},
							data: {
								type: 'string',
								example: 'null',
							},
						},
					},
				},
			},
		},
		'400': {
			description: 'Reply with given id does not exist',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: false,
							},
							statusCode: {
								type: 'number',
								example: 400,
							},
							message: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '1ScriKUgR1mbnTxqHKtuvmHNGndEYfny',
									},
									msg: {
										type: 'string',
										example: 'User with given public key does not exit',
									},
									param: {
										type: 'string',
										example: 'user_email',
									},
									location: {
										type: 'string',
										example: 'body',
									},
								},
							},
							data: {
								type: 'string',
								example: null,
							},
						},
					},
				},
			},
		},
		'404': {
			description: 'Reply with given id does not exist',
			content: {
				'application/json': {
					schema: {
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
								example: 'Reply does not exist',
							},
							data: {
								type: 'string',
								example: null,
							},
						},
					},
				},
			},
		},
		'500': {
			description: 'Internal Server Error',
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/internalError',
					},
				},
			},
		},
	},
};

const updateReply = {
	tags: ['Replies'],
	description: 'Mark reply as best reply',
	operationId: 'updateReply',
	parameters: [
		{
			name: 'id',
			in: 'path',
			description: 'Reply id',
			required: true,
			type: 'number',
		},
	],
	requestBody: {
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/pubkeyRequestBody',
				},
			},
		},
		required: true,
	},
	responses: {
		'200': {
			description: 'Successfully updated reply',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: true,
							},
							statusCode: {
								type: 'number',
								example: 200,
							},
							message: {
								type: 'string',
								example: 'Successfully updated reply',
							},
							data: {
								type: 'object',
								properties: {
									id: {
										type: 'number',
										example: 6,
									},
									content: {
										type: 'string',
										example:
											'Tempora eligendi tenetur porro deserunt optio tempore eveniet laboriosam. Voluptatum iure autem commodi voluptates.',
									},
									user_email: {
										type: 'string',
										example: 'david@heartbit.io',
									},
									question_id: {
										type: 'string',
										example: 5,
									},
									best_reply: {
										type: 'boolean',
										example: true,
									},
									createdAt: {
										type: 'string',
										example: '2023-04-11T11:49:39.209Z',
									},
									updatedAt: {
										type: 'string',
										example: '2023-04-14T03:34:44.239Z',
									},
								},
							},
						},
					},
				},
			},
		},
		'400': {
			description: 'Error updating reply',
			content: {
				'application/json': {
					schema: {
						type: 'object',
						properties: {
							success: {
								type: 'boolean',
								example: false,
							},
							statusCode: {
								type: 'number',
								example: 400,
							},
							message: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '1ScriKUgR1mbnTxqHKtuvmHNGndEYfny',
									},
									msg: {
										type: 'string',
										example: 'User with given public key does not exit',
									},
									param: {
										type: 'string',
										example: 'user_email',
									},
									location: {
										type: 'string',
										example: 'body',
									},
								},
							},
							data: {
								type: 'string',
								example: null,
							},
						},
					},
				},
			},
		},
		'404': {
			description: 'Question for this reply does not exist',
			content: {
				'application/json': {
					schema: {
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
								example: 'Question for this reply does not exist',
							},
							data: {
								type: 'string',
								example: null,
							},
						},
					},
				},
			},
		},
		'422': {
			description: 'Error updating reply',
			content: {
				'application/json': {
					schema: {
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
								example:
									'Only user that posted a question can mark reply as best reply',
							},
							data: {
								type: 'string',
								example: null,
							},
						},
					},
				},
			},
		},
		'500': {
			description: 'Internal Server Error',
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/schemas/internalError',
					},
				},
			},
		},
	},
};

const createReplyBody = {
	type: 'object',
	properties: {
		user_email: {
			type: 'string',
			example: 'david@heartbit.io',
		},
		content: {
			type: 'string',
			example:
				'This is a reply to your question and it has the following content',
		},
		question_id: {
			type: 'number',
			example: 51,
		},
	},
};

const pubkeyRequestBody = {
	type: 'object',
	properties: {
		user_email: {
			type: 'string',
			example: 'david@heartbit.io',
		},
	},
};

export {
	createReply,
	createReplyBody,
	deleteReply,
	getReply,
	getChatgptReply,
	updateReply,
	pubkeyRequestBody,
};
