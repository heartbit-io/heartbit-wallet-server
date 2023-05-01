const getReply = {
	tags: ['Questions'],
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
	tags: ['Questions'],
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

const createQuestion = {
	tags: ['Questions'],
	description: 'Create a new question',
	operationId: 'createQuestion',
	security: [
		{
			bearerAuth: {},
		},
	],
	requestBody: {
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/createQuestionBody',
				},
			},
		},
		required: true,
	},
	responses: {
		'201': {
			description: 'Post a new health question',
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
								example: 'Question posted successfully',
							},
							data: {
								type: 'object',
								properties: {
									id: {
										type: 'number',
										example: 51,
									},
									status: {
										type: 'string',
										enum: ['open', 'closed'],
										example: 'open',
									},
									content: {
										type: 'string',
										example:
											'I have tooth sensitivity when I used toothpick today, what should I do?',
									},
									bountyAmount: {
										type: 'number',
										example: 100,
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
			description: 'Validation error posting a question',
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
										example: '1HyLaz8vc63kZA61zT3ys1fqEU168121377919',
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
const getQuestion = {
	tags: ['Questions'],
	description: 'Get question details',
	operationId: 'getQuestion',
	parameters: [
		{
			name: 'id',
			in: 'path',
			description: 'Question id',
			required: true,
			type: 'number',
		},
	],
	responses: {
		'200': {
			description: 'Successfully retrieved user details',
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
								example: 'Successfully retrieved question details',
							},
							data: {
								type: 'object',
								properties: {
									id: {
										type: 'number',
										example: 51,
									},
									userId: {
										type: 'number',
										example: 12,
									},
									content: {
										type: 'string',
										example:
											'Itaque ratione aperiam doloribus est. Inventore minus exercitationem. Quasi at nam delectus fugit corporis',
									},
									bountyAmount: {
										type: 'number',
										example: 10000,
									},
									status: {
										type: 'string',
										enum: ['open', 'closed'],
										example: 'open',
									},
									createdAt: {
										type: 'string',
										example: '2023-04-12T21:36:10.115Z',
									},
									updatedAt: {
										type: 'string',
										example: '2023-04-12T21:36:10.115Z',
									},
									replies: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: {
													type: 'number',
													example: 29,
												},
												content: {
													type: 'string',
													example:
														'Molestiae officiis ex porro aliquam magnam ex aperiam. Ipsam quis consequuntur perspiciatis quidem repudiandae. Recusandae ullam praesentium dolores odit quis exercitationem exercitationem.',
												},
												questionId: {
													type: 'number',
													example: 51,
												},
												userId: {
													type: 'number',
													example: 12,
												},
												createdAt: {
													type: 'string',
													example: '2023-04-11T11:49:39.200Z',
												},
												updatedAt: {
													type: 'string',
													example: '2023-04-11T11:49:39.200Z',
												},
											},
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'404': {
			description: 'Question with given id not found',
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
								example: 'Question was not found',
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

const getAllQuestions = {
	tags: ['Questions'],
	description: 'Get all questions',
	operationId: 'getAllQuestions',
	responses: {
		'200': {
			description: 'Successfully retrieved questions',
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
								example: 'Successfully retrieved questions',
							},
							data: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: {
											type: 'number',
											example: 51,
										},
										userId: {
											type: 'number',
											example: 12,
										},
										content: {
											type: 'string',
											example:
												'Itaque ratione aperiam doloribus est. Inventore minus exercitationem. Quasi at nam delectus fugit corporis',
										},
										bountyAmount: {
											type: 'number',
											example: 10000,
										},
										status: {
											type: 'string',
											enum: ['open', 'closed'],
											example: 'closed',
										},
										createdAt: {
											type: 'string',
											example: '2023-04-12T21:36:10.115Z',
										},
										updatedAt: {
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

const getOpenQuestionsOrderByBounty = {
	tags: ['Questions'],
	description: 'Get all open questions',
	operationId: 'getAllOpenQuestions',
	responses: {
		'200': {
			description: 'Successfully retrieved questions',
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
								example: 'Successfully retrieved all open questions',
							},
							data: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										id: {
											type: 'number',
											example: 51,
										},
										userId: {
											type: 'number',
											example: 12,
										},
										content: {
											type: 'string',
											example:
												'Itaque ratione aperiam doloribus est. Inventore minus exercitationem. Quasi at nam delectus fugit corporis',
										},
										bountyAmount: {
											type: 'number',
											example: 10000,
										},
										status: {
											type: 'string',
											enum: ['open', 'closed'],
											example: 'open',
										},
										createdAt: {
											type: 'string',
											example: '2023-04-12T21:36:10.115Z',
										},
										updatedAt: {
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

const deleteQuestion = {
	tags: ['Questions'],
	description: 'Delete given question',
	operationId: 'deleteQuestion',
	parameters: [
		{
			name: 'id',
			in: 'path',
			description: 'Question id',
			required: true,
			type: 'number',
		},
	],
	responses: {
		'200': {
			description: 'Successfully deleted question',
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
								example: 'Successfully deleted question',
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
		'404': {
			description: 'Question with given id not found',
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
								example: 'Question was not found',
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

const createQuestionBody = {
	type: 'object',
	properties: {
		content: {
			type: 'string',
			example:
				'I have tooth sensitivity when I used toothpick today, what should I do?',
		},
		bountyAmount: {
			type: 'number',
			example: 10000,
		},
	},
};

export {
	createQuestion,
	getQuestion,
	createQuestionBody,
	getAllQuestions,
	getOpenQuestionsOrderByBounty,
	deleteQuestion,
	getReply,
	getChatgptReply,
};
