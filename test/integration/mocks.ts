import {faker} from '@faker-js/faker';
import BtcTransactionsRepository from '../../src/Repositories/BtcTransactionsRepository';
import {BtcTransaction} from '../../src/domains/entities/BtcTransaction';
import {
	QuestionStatus,
	QuestionTypes,
	ReplyStatus,
	TxTypes,
	UserRoles,
} from '../../src/util/enums';
import UserRepository from '../../src/Repositories/UserRepository';
import {QuestionAttributes} from '../../src/domains/entities/Question';
import QuestionRepository from '../../src/Repositories/QuestionRepository';
import {RepliesAttributes} from '../../src/domains/entities/Reply';
import ReplyRepository from '../../src/Repositories/ReplyRepository';
import {ChatgptRepliesAttributes} from '../../src/domains/entities/ChatGptReply';
import ChatGptRepository from '../../src/Repositories/ChatGptRepository';

export const newUser = () => {
	return {
		id: faker.number.int({min: 1, max: 50}),
		email: faker.internet.email().toLocaleLowerCase(),
		pubkey: faker.string.alphanumeric(32).toLocaleLowerCase(),
		btcBalance: Number(faker.finance.amount()),
		role: faker.helpers.arrayElement(Object.values(UserRoles)),
		promotionBtcBalance: 0,
		fcmToken: faker.string.alphanumeric(32),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		deletedAt: null,
	};
};

export const createUser = async (user: any) => {
	return await UserRepository.createUser(user);
};

export const newBtcTransaction = () => {
	return {
		id: faker.number.int({min: 1, max: 50}),
		amount: Number(faker.finance.amount()),
		fromUserPubkey: faker.string.alphanumeric(32),
		toUserPubkey: faker.string.alphanumeric(32),
		fee: Number(faker.finance.amount()),
		type: faker.helpers.arrayElement(Object.values(TxTypes)),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		deletedAt: null,
	};
};

export const createBtcTransaction = async (btcTransaction: BtcTransaction) => {
	return await BtcTransactionsRepository.createTransaction(btcTransaction);
};

export const newQuestion = () => {
	return {
		content: faker.lorem.paragraph(),
		rawContentLanguage: faker.lorem.word(),
		rawContent: faker.lorem.sentence(),
		userId: faker.number.int({min: 1, max: 50}),
		bountyAmount: faker.number.int({min: 1000, max: 10000}),
		status: faker.helpers.arrayElement(Object.values(QuestionStatus)),
		type: faker.helpers.arrayElement(Object.values(QuestionTypes)),
		currentMedication: faker.lorem.sentence(),
		ageSexEthnicity: faker.lorem.sentence(),
		pastIllnessHistory: faker.lorem.sentence(),
		others: faker.lorem.sentence(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		deletedAt: null,
	};
};

export const createQuestion = async (question: QuestionAttributes) => {
	return await QuestionRepository.create(question);
};

export const newReply = () => {
	return {
		id: faker.number.int({min: 1, max: 50}),
		questionId: faker.number.int({min: 1, max: 50}),
		userId: faker.number.int({min: 1, max: 50}),
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
		status: faker.helpers.arrayElement(Object.values(ReplyStatus)),
		majorComplaint: faker.lorem.sentence(),
		medicalHistory: faker.lorem.sentence(),
		currentMedications: faker.lorem.sentence(),
		assessment: faker.lorem.sentence(),
		plan: faker.lorem.sentence(),
		triage: faker.lorem.sentence(),
		doctorNote: faker.lorem.paragraph(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		deletedAt: null,
	};
};

export const createReply = async (reply: RepliesAttributes) => {
	return await ReplyRepository.createReply(reply);
};

const jsonAnswer = () => {
	return {
		title: faker.lorem.sentence(),
		aiAnswer: faker.lorem.paragraph(),
		doctorAnswer: faker.lorem.paragraph(),
		guide: faker.lorem.paragraph(),
		chiefComplaint: faker.lorem.sentence(),
		medicalHistory: faker.lorem.sentence(),
		currentMedication: faker.lorem.sentence(),
		assessment: faker.lorem.sentence(),
		plan: faker.lorem.sentence(),
		doctorNote: faker.lorem.paragraph(),
	};
};
export const chatGptReply = () => {
	return {
		id: faker.number.int({min: 1, max: 50}),
		questionId: faker.number.int({min: 1, max: 50}),
		model: 'gpt-3.5-turbo',
		maxTokens: 150,
		prompt: faker.lorem.sentence(),
		rawAnswer: faker.lorem.paragraph(),
		jsonAnswer: jsonAnswer(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		deletedAt: null,
	};
};

export const createChatGptReply = async (
	chatGptReply: ChatgptRepliesAttributes,
) => {
	return await ChatGptRepository.createChaptgptReply(chatGptReply);
};
