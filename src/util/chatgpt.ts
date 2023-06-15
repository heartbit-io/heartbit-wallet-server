import {JsonAnswerInterface} from '../models/ChatgptReplyModel';
import {QuestionAttributes} from '../models/QuestionModel';
import {QuestionTypes} from '../util/enums/questionTypes';

// TODO(david): Consider the patient's profile
export function makePrompt(question: QuestionAttributes): string {
	switch (question.type) {
		case QuestionTypes.GENERAL:
			return `
				You are an experienced licensed doctor who sees a patient in teleconsultation. I will show you a patient's question. Please write a few paragraphs of a kind answer and label it with 'DoctorAnswer'.  All descriptions and answers should be in markdown format. Do not use bullet points.
				Then,
				- Derive a title from the question and label it with 'Title'. If 'Title' is empty, the Title should be <today's date>.
				- Derive a short summary from 'DoctorAnswer' and label it with 'AIanswer'.
				- For Title, DoctorAnswer, AIanswer, use Markdown's H2 tag format.
				- 'AIanswer' and 'DoctorAnswer' should be written in the tone and manner in which you would speak to a patient.
				- Please make sure to fill out the 'AIanswer' field.
				If you determine that the question is unrelated to any illness or health matter, you should ignore all of the above and write, "Sorry I can't answer anything but health-related questions" in your response.

				Now write answers to the following patient's question:
				- Question: ${question.content}
				- Age, Sex, and Ethnicity: ${question.ageSexEthnicity}
			`;
		default:
			return `
				You are an experienced licensed doctor who sees a patient in teleconsultation. I will show you a patient's case. Please organize the patient's description and write answers in a clinical record format with the following conditions:
				- All descriptions and answers should be bullet-pointed and in markdown format. Do not use bullet points.
				- Category: 'Title', 'Guide', 'Chief Complaint', 'Medical History', 'Current Medication', 'Assessment', and 'Plan'
				- For Categories, use Markdown's H2 tag format.
				- 'Title' should be derived from the 'Chief Complaint'. If 'Chief Complaint' is empty, the Title should be Question on <today's date>
				- 'Guide' should include a short explanation of what simple symptomatic treatment can be done at home in the patient's case and what kind of condition it is best to visit the hospital.
				- Guides should be written in the tone and manner in which you would speak to a patient.
				- Please make sure to fill out the 'Guide' field.
				- The patient's profile information should be excluded from the 'Medical history' section.

				Then, write a few paragraphs of kind note titled 'Doctor's note' to the patient based on the 'Heath record'.
				If you determine that the question is unrelated to any illness or health matter, you should ignore all of the above and write, "Sorry, I can't answer anything but health-related questions" in your response.

				Now write answers to the following patient's question:
				- History of Present Illness: ${question.content}
				- Current medication: ${question.currentMedication}
				- Past illness history of you or your family: ${question.pastIllnessHistory}
				- Age, Sex, and Ethnicity: ${question.ageSexEthnicity}
				- Others: ${question.others}
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
