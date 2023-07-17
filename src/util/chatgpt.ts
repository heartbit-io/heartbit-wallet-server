// import {QuestionAttributes} from '../models/QuestionModel';
import {Question, QuestionAttributes} from '../domains/entities/Question';

import {JsonAnswerInterface} from '../domains/entities/ChatGptReply';
import {QuestionTypes} from '../util/enums/questionTypes';

// TODO(david): Consider the patient's profile
export function makePrompt(question: QuestionAttributes): string {
	switch (question.type) {
		case QuestionTypes.GENERAL:
			return `
				You are a Dr.HeartBit, a kind and professional doctor.
				Write a short and kind answer to the patient with the following conditions:
				
				- Category: "aiAnswer", "title"
				- "aiAnswer" should have at least 200 words. 
				- "title" should be derived from the patient's question
				- Please provide your answer in JSON format with each category as a key and the value of each key.
				
				If you determine that the question is unrelated to any illness or health matter, you should ignore the above and write, "I can't answer anything but health-related questions" in 'aiAnswer'.
				
				Now write answers to the following patient's question:
				- Question: ${question.content}
				- Age, Sex, and Ethnicity: ${question.ageSexEthnicity}
			`;
		default:
			return `
				You are a Dr.HeartBit, a kind and professional doctor. 

				Your job is to organize the patient's description and write answers in a clinical record format with the following conditions after receiving a set of descriptions:
				- Category: "chiefComplaint", "medicalHistory", "currentMedication", "assessment", "plan", "guide", "doctorNote", and "title".
				- "title" should be derived from the "Chief Complaint"
				- "guide" should include a short explanation of what simple symptomatic treatment can be done at home in the patient's case and what kind of condition it is best to visit the hospital.
				- "guide" should be written in the tone and manner you would speak to a patient.
				- Please make sure to fill out the "guide" field.
				- The patient's profile information should be excluded from the "medicalHistory" section.
				- All answers above should be bullet-pointed.
				- "doctorNote" should have a few paragraphs of kind notes for the patient based on the answers from the other categories in at least 500 words. 
				- Please provide your answer in JSON format with each category as a key and the value of each key.
				- Please put the value in string format.

				If you determine that the question is unrelated to any illness or health matter, you should ignore the above and write, "Sorry, I can't answer anything but health-related questions" in your response.

				Now write an answer to the following patient's description:
				- Current symptoms: ${question.content}
				- Current medication: ${question.currentMedication}
				- Medical History: ${question.pastIllnessHistory}
				- Age, Sex, Ethnicity: ${question.ageSexEthnicity}
				- Allergies, dietary habits, and exercise: ${question.lifestyle}
				- Specific questions: ${question.others}
			`;
	}
}

export function makeAnswerToJson(answer: string): JsonAnswerInterface {
	const jsonAnswer: JsonAnswerInterface = {
		title: '',
		aiAnswer: '',
		doctorAnswer: '',
		guide: '',
		chiefComplaint: '',
		medicalHistory: '',
		currentMedication: '',
		assessment: '',
		plan: '',
		doctorNote: '',
	};

	const unableToRespond =
		"Sorry I can't answer anything but health-related questions.";
	if (answer === unableToRespond) {
		jsonAnswer.aiAnswer = unableToRespond;
	}

	const regexes = {
		doctorAnswer: /## DoctorAnswer\s*(.*)/i,
		title: /## Title\s*(.*)/i,
		aiAnswer: /## AIanswer\s*(.*)/i,
		guide: /## Guide\s*([\s\S]*)## Chief Complaint/i,
		chiefComplaint: /## Chief Complaint\s*([\s\S]*)## Medical History/i,
		medicalHistory: /## Medical History\s*([\s\S]*)## Current Medication/i,
		currentMedication: /## Current Medication\s*([\s\S]*)## Assessment/i,
		assessment: /## Assessment\s*([\s\S]*)## Plan/i,
		plan: /## Plan\s*([\s\S]*)## Doctor's Note/i,
		doctorNote: /## Doctor's Note\s*([\s\S]*)/i,
	};

	const toJson = (answer: string) => {
		for (const [key, regex] of Object.entries(regexes)) {
			const match = answer.match(regex);
			if (match) jsonAnswer[key] = match[1].trim();
		}
		return jsonAnswer;
	};

	return toJson(answer);
}
