const createUser = {
	tags: ['Users'],
	description: 'Create a new user',
	operationId: 'createUser',
	requestBody: {
		content: {
			'application/json': {
				schema: {
					$ref: '#/components/schemas/createUserBody',
				},
			},
		},
		required: true,
	},
	responses: {
		'201': {
			description: 'User created successfully!',
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
								example: 'User created successfully',
							},
							data: {
								type: 'object',
								properties: {
									id: {
										type: 'number',
										example: 51,
									},
									pubkey: {
										type: 'string',
										example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
									},
									email: {
										type: 'string',
										example: 'david@heartbit.io',
									},
									role: {
										type: 'string',
										enum: ['user', 'doctor', 'admin'],
										example: 'user',
									},
									btcBalance: {
										type: 'number',
										example: 10000,
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
			description: 'Validation error creating a user',
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
										example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
									},
									msg: {
										type: 'string',
										example: 'User with given public key exits',
									},
									param: {
										type: 'string',
										example: 'pubkey',
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
const getUser = {
	tags: ['Users'],
	description: 'Get user details',
	operationId: 'getUser',
	parameters: [
		{
			name: 'email',
			in: 'path',
			description: 'User email key',
			required: true,
			type: 'string',
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
								example: 'Successfully retrieved user details',
							},
							data: {
								type: 'object',
								properties: {
									id: {type: 'number', example: 51},
									pubkey: {
										type: 'string',
										example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
									},
									email: {
										type: 'string',
										example: 'david@heartbit.io',
									},
									role: {
										type: 'string',
										enum: ['user', 'admin', 'doctor'],
										example: 'user',
									},
									btcBalance: {
										type: 'string',
										example: 10000,
									},
									createdAt: {
										type: 'string',
										example: '2023-04-12T21:36:10.115Z',
									},
									updatedAt: {
										type: 'string',
										example: '2023-04-12T21:36:10.115Z',
									},
									questions: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: {
													type: 'number',
													example: 1,
												},
												content: {
													type: 'string',
													example:
														'Molestiae officiis ex porro aliquam magnam ex aperiam. Ipsam quis consequuntur perspiciatis quidem repudiandae.',
												},
												userId: {
													type: 'number',
													example: 12,
												},
												bountyAmount: {
													type: 'number',
													example: 281.33,
												},
												status: {
													type: 'string',
													enum: ['closed', 'open'],
													example: 'closed',
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
														'Molestiae officiis ex porro aliquam magnam ex aperiam. Ipsam quis consequuntur perspiciatis quidem repudiandae.',
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
									transactions: {
										type: 'array',
										items: {
											type: 'object',
											properties: {
												id: {
													type: 'number',
													example: 8,
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
												createdAt: {
													type: 'string',
													example: '2023-04-11T11:49:39.215Z',
												},
												updatedAt: {
													type: 'string',
													example: '2023-04-11T11:49:39.215Z',
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

const createUserBody = {
	type: 'object',
	properties: {
		pubkey: {
			type: 'string',
			example: '3cX325ViRWa2R9Mfqf1BCQxCc1s',
		},
		email: {
			type: 'string',
			example: 'david@heartbit.io',
		},
		role: {
			type: 'string',
			example: 'user',
		},
		btcBalance: {
			type: 'number',
			example: 10000,
		},
	},
};

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

export {createUser, createUserBody, getUser, internalError};
