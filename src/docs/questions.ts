const replyResponseData = {
	type: 'object',
	properties: {
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
		content: {
			type: 'string',
			example:
				'This is a reply to your question and it has the following content',
		},
		replyType: {
			type: 'string',
			example: 'DOCTOR',
		},
		reply: {
			type: 'string',
			example:
				'This is a reply to your question and it has the following content',
		},
		classification: {
			type: 'string',
			example: 'General physician',
		},
		name: {
			type: 'string',
			example: 'Dr. John Doe',
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
		assessment: {
			type: 'string',
			example: 'You have a headache',
		},
		triage: {
			type: 'string',
			example: 'You need to take paracetamol',
		},
	},
};

const questionResponseData = {
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
	type: {
		type: 'string',
		enum: ['general', 'illness'],
		example: 'general',
	},
	ageSexEthnicity: {
		type: 'string',
		example: '24 yr old, male, korean',
	},
	pastIllnessHistory: {
		type: 'string',
		example: 'Early cataracts',
	},
	others: {
		type: 'string',
		example: 'Share anything that might help',
	},
	createdAt: {
		type: 'string',
		example: '2023-04-12T21:36:10.115Z',
	},
	updatedAt: {
		type: 'string',
		example: '2023-04-12T21:36:10.115Z',
	},
};

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
							data: replyResponseData,
						},
					},
				},
			},
		},
		'422': {
			description: 'Not Found Error',
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/responses/notFoundError',
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

const createChatgptReply = {
	tags: ['Questions'],
	description: 'create a reply from chatgpt',
	operationId: 'createChatgptReply',
	requestBody: {
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						questionId: {
							type: 'number',
							example: 1,
						},
					},
				},
			},
		},
		required: true,
	},
	responses: {
		'201': {
			description: 'Reply from ChatGPT generated successfully',
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
								example: 'ChatGPT Reply generated successfully',
							},
							data: replyResponseData,
						},
					},
				},
			},
		},
		'422': {
			description: 'Not Found Error',
			content: {
				'application/json': {
					schema: {
						$ref: '#/components/responses/notfoundError',
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
								properties: questionResponseData,
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
						$ref: '#/components/responses/internalError',
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
			name: 'questionId',
			in: 'path',
			description: 'Question id',
			required: true,
			type: 'number',
		},
	],
	responses: {
		'200': {
			description: 'Successfully retrieved question details',
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
									...questionResponseData,
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
						$ref: '#/components/responses/internalError',
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
	parameters: [
		{
			name: 'limit',
			in: 'query',
			description: 'questions limit query parameter',
			required: false,
			type: 'number',
		},
		{
			name: 'offset',
			in: 'query',
			description: 'questions offset query parameter',
			required: false,
			type: 'number',
		},
		{
			name: 'order',
			in: 'query',
			description: 'questions order query parameter, desc or asc',
			required: false,
			type: 'string',
		},
	],
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
									properties: questionResponseData,
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
						$ref: '#/components/responses/internalError',
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
									properties: questionResponseData,
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
						$ref: '#/components/responses/internalError',
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
			name: 'questionId',
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
						$ref: '#/components/responses/internalError',
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
				'(required) I have tooth sensitivity when I used toothpick today, what should I do?',
		},
		bountyAmount: {
			type: 'number',
			example: 10000,
		},
		type: {
			type: 'number',
			example: 10000,
		},
		currentMedication: {
			type: 'string',
			example: '(optional) I am taking paracetamol',
		},
		ageSexEthnicity: {
			type: 'string',
			example: '(optional) 24, male, korean',
		},
		pastIllnessHistory: {
			type: 'string',
			example: '(optional) Early cataracts',
		},
		others: {
			type: 'string',
			example: '(optional) Share anything that might help',
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
	createChatgptReply,
};
