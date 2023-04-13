import {log} from 'console';
import {config} from 'dotenv';
import { createUser, createUserBody, getUser, internalError } from './users';
import { createQuestion, createQuestionBody, getQuestion, getAllQuestions, deleteQuestion } from './questions';

config();

if (!process.env.PORT) {
	log('Set server port');
	process.exit(1);
}

const apiDocumentation = {
	openapi: '3.0.1',
	info: {
		version: '1.0.0',
		title: 'heartbit-wallet-server',
		description: 'Data wallet server',
		termsOfService: '',
		contact: {
			name: 'Heartbit',
			email: 'dev@heartbit.io',
			url: 'https://heartbit.io',
		},
		license: {
			name: 'Apache 2.0',
			url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
		},
	},
	servers: [
		{
			url: `http://localhost:${process.env.PORT}/`,
			description: 'Local Server',
		},
		{
			url: '',
			description: 'Production Server',
		},
	],
	tags: [
		{
			name: 'Questions',
		},
		{
			name: 'Users',
		},
		{
			name: 'Replies',
		},
		{
			name: 'Transactions',
		},
	],
	paths: {
		users: {
            post: createUser,
        },
        'users/ { pubkey }': {
            get: getUser,
		},
		questions: {
			post: createQuestion,
			get: getAllQuestions,
		},
		'questions/{id}': {
			get: getQuestion,
			delete: deleteQuestion,
		},
	},
	components: {
		schemas: {
			createUserBody,
			internalError,
			createQuestion,
			createQuestionBody
		},
	},
};

export {apiDocumentation};
