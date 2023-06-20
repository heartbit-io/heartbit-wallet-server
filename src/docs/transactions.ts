const getUserTransactions = {
	tags: ['Transactions'],
	description: 'Get user transactions',
	operationId: 'getUserTransactions',
	parameters: [
		{
			name: 'pubkey',
			in: 'path',
			description: 'user public key',
			required: true,
			type: 'string',
		},
		{
			name: 'limit',
			in: 'query',
			description: 'transactions limit query parameter',
			required: false,
			type: 'number',
		},
		{
			name: 'offset',
			in: 'query',
			description: 'transactions offset query parameter',
			required: false,
			type: 'number',
		},
	],
	responses: {
		'200': {
			description: 'Successfully retrieved user transactions',
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
								example: 'Successfully retrieved user transactions',
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
										fromUserPubkey: {
											type: 'string',
											example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
										},
										toUserPubkey: {
											type: 'string',
											example: '1Bwp51hh1iAtBKtMgB2JJvoPTEiYDSA',
										},
										amount: {
											type: 'number',
											example: 205.24,
										},
										type: {
											type: 'string',
											example: 'deposit',
										},
										fee: {
											type: 'number',
											example: 100,
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
		'400': {
			description: 'User public key is required',
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
								type: 'string',
								example: 'User with given public key was not found',
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
										example: 'User with given public key does not exits',
									},
									param: {
										type: 'string',
										example: 'pubkey',
									},
									location: {
										type: 'string',
										example: 'params',
									},
								},
							},
						},
					},
				},
			},
		},
		'404': {
			description: 'User does not have any transaction',
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

export {getUserTransactions};
