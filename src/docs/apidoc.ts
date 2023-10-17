import {
	createChatgptReply,
	createQuestion,
	createQuestionBody,
	deleteQuestion,
	getAllQuestions,
	getOpenQuestionsOrderByBounty,
	getQuestion,
	getReply,
} from './questions';
import {
	createReply,
	createReplyBody,
	deleteReply,
	pubkeyRequestBody,
	updateReply,
} from './replies';
import {createUser, createUserBody, getUser} from './users';
import {
	getDoctorAnsweredQuestion,
	getDoctorAnsweredQuestions,
	getDoctorQuestion,
	getDoctorQuestions,
} from './doctors';
import {
	internalError,
	notFoundError,
	unprocessedContentError,
} from './responses';

import env from '../config/env';
import {getCoinExchangeRates} from './coinExchangeRate';
import {getUserTransactions} from './transactions';
import {log} from 'console';

if (!env.PORT) {
	log('Set server port');
	process.exit(1);
}

const apiVersion = 'api/v1';

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
	security: [{bearerAuth: [], apiKey: []}],
	servers: [
		{
			url: `http://localhost:${env.PORT}/${apiVersion}`,
			description: 'Local Server',
		},
		{
			url: `https://wallet-api.heartbit.io/${apiVersion}`,
			description: 'Deveploment Server',
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
		{
			name: 'Coin Exchange Rate',
		},
	],
	paths: {
		'/users': {
			post: createUser,
		},
		'/users/{email}': {
			get: getUser,
		},
		'/questions': {
			post: createQuestion,
			get: getAllQuestions,
		},
		'/questions/open': {
			get: getOpenQuestionsOrderByBounty,
		},
		'/questions/{questionId}': {
			get: getQuestion,
			delete: deleteQuestion,
		},
		'/questions/{questionId}/replies': {
			get: getReply,
		},
		'/questions/chat-gpt-replies': {
			post: createChatgptReply,
		},
		'/replies': {
			post: createReply,
		},
		'/replies/{replyId}': {
			patch: updateReply,
			delete: deleteReply,
		},
		'/transactions/{pubkey}': {
			get: getUserTransactions,
		},
		'/coin-exchange-rates/btc': {
			get: getCoinExchangeRates,
		},
		'/doctors/questions': {
			get: getDoctorQuestions,
		},
		'/doctors/questions/{questionId}': {
			get: getDoctorQuestion,
		},
		'/doctors/answered-questions': {
			get: getDoctorAnsweredQuestions,
		},
		'/doctors/answered-questions/{questionId}': {
			get: getDoctorAnsweredQuestion,
		},
	},
	components: {
		schemas: {
			createUserBody,
			createQuestion,
			createQuestionBody,
			createReplyBody,
			pubkeyRequestBody,
		},
		securitySchemes: {
			bearerAuth: {
				type: 'http',
				in: 'header',
				name: 'Authorization',
				description: 'Bearer Token',
				scheme: 'bearer',
				bearerFormat: 'JWT',
			},
			apiKey: {
				type: 'apiKey',
				in: 'header',
				name: 'apikey', // XXX: not camelCase becouse of http header naming convention
			},
		},
		responses: {
			internalError,
			notFoundError,
			unprocessedContentError,
		},
	},
};

export {apiDocumentation};
