const getQuestions = {
	tags: ['Doctors'],
	description:
		'Get doctors questions(sort by bounty), user information is not yet. implementing after mydata tab',
	operationId: 'getQuestions',
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
	],
	responses: {
		'200': {
			description: 'Successfully retrieved doctors questions',
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
								example: 'Successfully retrieved doctors questions',
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
										bountyAmount: {
											type: 'number',
											example: 1000,
										},
										content: {
											type: 'string',
											example:
												"I have early cataracts. I've been taking MTX steroid 1.5 tablets for 2 weeks now for arthritis, is it okay to take it? I'm scared because my eyes feel like they've gotten worse.",
										},
										userId: {
											type: 'number',
											example: 12,
										},
										createdAt: {
											type: 'string',
											example: '2023-05-12T21:36:10.115Z',
										},
										updatedAt: {
											type: 'string',
											example: '2023-05-12T21:36:10.115Z',
										},
									},
								},
							},
						},
					},
				},
			},
		},
		'401': {
			description: 'User must be a doctor to get user questions',
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
								example: 401,
							},
							message: {
								type: 'string',
								example: 'User must be a doctor to get user questions',
							},
							data: {
								type: 'object',
								properties: {
									value: {
										type: 'string',
										example: '3cX325ViRWa2R9Mfqf1BkhkCQxCc1s',
									},
									msg: {
										type: 'string',
										example: 'User must be a doctor to get user questions',
									},
								},
							},
						},
					},
				},
			},
		},
		'404': {
			description: 'User does not have any questions',
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
								example: 'User does not have any transaction',
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

export {getQuestions};
