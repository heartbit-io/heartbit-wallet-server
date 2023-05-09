const getCoinExchangeRates = {
	tags: ['Coin Exchage Rate'],
	description: 'Get coin exchange rate',
	operationId: 'getCoinExchangeRates',
	parameters: [
		{
			name: 'satoshi',
			in: 'query',
			description: 'satoshi for user',
			required: false,
			type: 'number',
		},
	],
	responses: {
		'200': {
			description: 'Successfully retrieved btc exchage rate',
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
								example: 'Successfully retrieved btc exchage rate',
							},
							data: {
								type: 'array',
								items: {
									type: 'object',
									properties: {
										10000: {
											type: 'number',
											example: 2.7,
										},
										1000: {
											type: 'number',
											example: 0.27,
										},
										custumSatoshi: {
											type: 'number',
											example: 1.5,
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
						$ref: '#/components/responses/internalError',
					},
				},
			},
		},
	},
};

export {getCoinExchangeRates};
