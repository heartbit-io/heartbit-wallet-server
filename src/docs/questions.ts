const createQuestion = {
	tags: ['Questions'],
	description: 'Create a new question',
	operationId: 'createQuestion',
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
									bounty_amount: {
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
										type: 'string',
										example: 'user_pubkey',
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
									user_pubkey: {
										type: 'string',
										example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
									},
									content: {
										type: 'string',
										example:
											'Itaque ratione aperiam doloribus est. Inventore minus exercitationem. Quasi at nam delectus fugit corporis',
									},
									bounty_amount: {
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
												question_id: {
													type: 'number',
													example: 51,
												},
												user_pubkey: {
													type: 'string',
													example: '15ATBNadTpqu696fQe8yGtJGjYAkUG',
												},
												best_reply: {
													type: 'boolean',
													example: false,
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
										user_pubkey: {
											type: 'string',
											example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
										},
										content: {
											type: 'string',
											example:
												'Itaque ratione aperiam doloribus est. Inventore minus exercitationem. Quasi at nam delectus fugit corporis',
										},
										bounty_amount: {
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
		user_pubkey: {
			type: 'string',
			example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
		},
		content: {
			type: 'string',
			example:
				'I have tooth sensitivity when I used toothpick today, what should I do?',
		},
		bounty_amount: {
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
	deleteQuestion,
};
