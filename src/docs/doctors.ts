const getDoctorQuestions = {
	tags: ['Doctors'],
	description:
		'Get doctor questions(sort by bounty), user information is not yet. implementing after myData tab',
	operationId: 'getDoctorQuestions',
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
			description: 'Successfully retrieved doctor questions',
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
								example: 'Successfully retrieved doctor questions',
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
										chiefComplaint: {
											type: 'string',
											example: 'Early cataracts',
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
								example: 'User does not have any questions',
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

const getDoctorQuestion = {
	tags: ['Doctors'],
	description:
		'Get doctor question by question id, user information is not yet. implementing after myData tab',
	operationId: 'getDoctorQuestion',
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
			description: 'Successfully retrieved doctor question',
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
								example: 'Successfully retrieved doctor questions',
							},
							data: {
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
									titlf: {
										type: 'string',
										example: 'reply title',
									},
									chiefComplaint: {
										type: 'string',
										example: 'Early cataracts',
									},
									medicalHistory: {
										type: 'string',
										example: 'Early cataracts / Arthritis',
									},
									currentMedications: {
										type: 'string',
										example:
											'Methotrexate (MTX) steroid: 1.5 tablets for 2 weeks',
									},
									assessment: {
										type: 'string',
										example:
											'The patient has early cataracts and is concerned about the effects of methotrexate on their eye condition.',
									},
									plan: {
										type: 'string',
										example:
											'Consult an ophthalmologist to assess the progression of cataracts and any potential impacts of methotrexate. Consult a rheumatologist to discuss the current arthritis treatment and explore possible alternatives if necessary.',
									},
									triage: {
										type: 'string',
										example:
											"The patient's case requires a consultation with an ophthalmologist and a rheumatologist.",
									},
									doctorNote: {
										type: 'string',
										example:
											"Dear Patient, Thank you for sharing your concerns about your early cataracts and the potential impact of methotrexate on your eye condition. I understand your concerns and have documented your case in the 'Health Record'.",
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
			description: 'User does not have any question',
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
								example: 'User does not have any question',
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

export {getDoctorQuestions, getDoctorQuestion};
