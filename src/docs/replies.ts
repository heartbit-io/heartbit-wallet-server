const replyBodyData = {
	userId: {
		type: 'number',
		example: 12,
	},
	content: {
		type: 'string',
		example:
			'This is a reply to your question and it has the following content',
	},
	questionId: {
		type: 'number',
		example: 51,
	},
	title: {
		type: 'string',
		example: 'Headache',
	},
	plan: {
		type: 'string',
		example: 'daily',
	},
	majorComplaint: {
		type: 'string',
		example: 'I have a headache and I feel dizzy',
	},
	medicalHistory: {
		type: 'string',
		example: 'I have a history of heart disease',
	},
	currentMedications: {
		type: 'string',
		example: 'I am currently taking paracetamol',
	},
	assessment: {
		type: 'string',
		example: 'You have a headache',
	},
	triage: {
		type: 'string',
		example: 'You need to take paracetamol',
	},
	doctorNote: {
		type: 'string',
		example: 'You need to take paracetamol',
	},
	status: {
		type: 'string',
		example: 'done',
	},
};

const replyResponseData = {
	id: {
		type: 'number',
		example: 6,
	},
	createdAt: {
		type: 'string',
		example: '2023-04-11T11:49:39.209Z',
	},
	updatedAt: {
		type: 'string',
		example: '2023-04-14T03:34:44.239Z',
	},
	...replyBodyData,
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
								properties: replyResponseData,
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
									param: {type: 'string', example: 'questionId'},
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
						$ref: '#/components/responses/internalError',
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
			name: 'replyId',
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
										type: 'number',
										example: 'userId',
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
						$ref: '#/components/responses/internalError',
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
			name: 'replyId',
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
								properties: replyResponseData,
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
										type: 'number',
										example: 'userId',
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
						$ref: '#/components/responses/internalError',
					},
				},
			},
		},
	},
};

const createReplyBody = {
	type: 'object',
	properties: replyBodyData,
};

const pubkeyRequestBody = {
	type: 'object',
	properties: {
		userId: {
			type: 'number',
			example: 12,
		},
	},
};

export {
	createReply,
	createReplyBody,
	deleteReply,
	updateReply,
	pubkeyRequestBody,
};
