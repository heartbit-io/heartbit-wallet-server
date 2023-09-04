// import {QuestionAttributes} from '../models/QuestionModel';
import {Question, QuestionAttributes} from '../domains/entities/Question';

import {JsonAnswerInterface} from '../domains/entities/ChatGptReply';
import {QuestionTypes} from '../util/enums/questionTypes';

// TODO(david): Consider the patient's profile
export function makePrompt(question: QuestionAttributes): string {
	switch (question.type) {
		case QuestionTypes.GENERAL:
			return `
			You are a Health Assistant. As a health assistant, you should write a few paragraphs of answers to the question.
			- Your answer should be neat and have a maximum of 600 characters.
			- If you determine that the question is unrelated to any illness or health matter, you should ignore the above and write, "Sorry, I can't answer anything but health-related questions" in your response.

			Now write answers to the following patient's question:
			- Question: """${question.content}"""
			- Age, and Sex: """${question.ageSexEthnicity}"""
			`;
		default:
			return `
			You are a Health Assistant. As a health assistant, you should write a few paragraphs of answers to the question.
			- In your answer, you must include a short explanation of what simple symptomatic treatment can be done at home in the patient's case and what kind of condition it is best to visit the hospital.
			- Your answer should be neat and have a maximum of 600 characters.
			- If you determine that the question is unrelated to any illness or health matter, you should ignore the above and write, "Sorry, I can't answer anything but health-related questions" in your response.
			
			Now write an answer to the following user's description:
			- Current symptoms: """${question.content}"""
			- Current medication: """${question.currentMedication}"""
			- Past Medical History: """${question.pastIllnessHistory}"""
			- Age, and Sex: """${question.ageSexEthnicity}"""
			- Specific questions: """${question.others}"""
			`;
	}
}
