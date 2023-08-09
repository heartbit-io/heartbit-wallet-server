import {
	QuestionStatus,
	QuestionTypes,
	ReplyStatus,
	TxTypes,
	UserRoles,
} from '../../src/util/enums';
import {BtcTransactionFields} from '../../src/domains/entities/BtcTransaction';
import BtcTransactionsRepository from '../../src/Repositories/BtcTransactionsRepository';
import {ChatGptReplyAttributes} from '../../src/domains/entities/ChatGptReply';
import ChatGptRepository from '../../src/Repositories/ChatGptRepository';
import {DoctorQuestionAttributes} from '../../src/domains/entities/DoctorQuestion';
import DoctorQuestionRepository from '../../src/Repositories/DoctorQuestionRepository';
import {QuestionAttributes} from '../../src/domains/entities/Question';
import QuestionRepository from '../../src/Repositories/QuestionRepository';
import {RepliesAttributes} from '../../src/domains/entities/Reply';
import ReplyRepository from '../../src/Repositories/ReplyRepository';
import {UserAttributes} from '../../src/domains/entities/User';
import UserRepository from '../../src/Repositories/UserRepository';
import {faker} from '@faker-js/faker';

export const newUser = (): UserAttributes => {
	return {
		email: faker.internet.email().toLocaleLowerCase(),
		pubkey: faker.string.alphanumeric(32).toLocaleLowerCase(),
		btcBalance: Number(faker.finance.amount()),
		role: faker.helpers.arrayElement(Object.values(UserRoles)),
		promotionBtcBalance: 0,
		fcmToken: faker.string.alphanumeric(32),
		airTableRecordId: undefined,
	};
};

export const createUser = async (user: UserAttributes) => {
	return await UserRepository.createUser(user);
};

export const newBtcTransaction = () => {
	return {
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

export const createBtcTransaction = async (
	btcTransaction: BtcTransactionFields,
) => {
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
		lifestyle: faker.lorem.sentence(),
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
		questionId: faker.number.int({min: 1, max: 50}),
		userId: faker.number.int({min: 1, max: 50}),
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
		status: faker.helpers.arrayElement(Object.values(ReplyStatus)),
		majorComplaint: faker.lorem.sentence(),
		presentIllness: faker.lorem.sentence(),
		pastMedicalHistory: faker.lorem.sentence(),
		currentMedications: faker.lorem.sentence(),
		assessment: faker.lorem.sentence(),
		plan: faker.lorem.sentence(),
		triage: faker.lorem.sentence(),
		lifestyle: faker.lorem.sentence(),
		doctorNote: faker.lorem.paragraph(),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		deletedAt: undefined,
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
		presentIllness: faker.lorem.sentence(),
		pastMedicalHistory: faker.lorem.sentence(),
		currentMedication: faker.lorem.sentence(),
		assessment: faker.lorem.sentence(),
		plan: faker.lorem.sentence(),
		doctorNote: faker.lorem.paragraph(),
	};
};
export const chatGptReply = () => {
	return {
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
	chatGptReply: ChatGptReplyAttributes,
) => {
	return await ChatGptRepository.createChaptGptReply(chatGptReply);
};

export const newDoctorQuestion = () => {
	return {
		doctorId: faker.number.int({min: 1, max: 50}),
		questionId: faker.number.int({min: 1, max: 50}),
		createdAt: faker.date.past(),
		updatedAt: faker.date.past(),
		deletedAt: null,
	};
};

export const saveDoctorQuestion = async (
	doctorQuestion: DoctorQuestionAttributes,
) => {
	return await DoctorQuestionRepository.createDoctorQuestion(doctorQuestion);
};

export const airTableDoctorDetails = () => {
	return {
		fields: {
			'First Name': 'John',
			'Last Name': 'Doe',
		},
	};
};

export const mockTranslatedContent = () => {
	return {
		replyId: faker.number.int({min: 1, max: 50}),
		translatedDoctorNote: faker.lorem.paragraph(),
		translatedTitle: faker.lorem.sentence(),
	};
};
