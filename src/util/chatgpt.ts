import {JsonAnswerInterface} from '../models/ChatgptReplyModel';
import {QuestionAttributes} from '../models/QuestionModel';
import {QuestionTypes} from '../util/enums/questionTypes';

// TODO(david): Consider the patient's profile
export function makePrompt(question: QuestionAttributes) {
	switch (question.type) {
		case QuestionTypes.GENERAL:
			return `
				You are an experienced licensed doctor who sees a patient in teleconsultation. Write short and kind answer to the patient and a title derived from the patient’s question.
				If you determine that the question is unrelated to any illness or health matter, you should ignore all of the above and write, "I can't answer anything but health-related questions" in your response.
				Now write answers to the following patient's question:
				- Question: ${question.content}
				- Age, Sex, and Ethnicity: ${question.basicInfo}
			`;
		case QuestionTypes.ILLNESS:
			return `
				You are an experienced licensed doctor who sees a patient in teleconsultation. I will show you a patient's case. Please organize the patient's description and write answers in a clinical record format with the following conditions:
				- All descriptions and answers should be bullet-pointed and in markdown format.
				- Category: 'Title', 'Guide', 'Chief Complaint', 'Medical History', 'Current Medication', 'Assessment', and 'Plan'
				- 'Title' should be derived from the 'Chief Complaint'. If 'Chief Complaint' is empty, the Title should be Question on <today's date>
				- 'Guide' should include a short explanation of what simple symptomatic treatment can be done at home in the patient's case and what kind of condition it is best to visit the hospital.
				- Guides should be written in the tone and manner in which you would speak to a patient.
				- Please make sure to fill out the 'Guide' field.
				- The patient's profile information should be excluded from the 'Medical history' section.

				Then, write a few paragraphs of kind note titled 'Doctor's note' to the patient based on the 'Heath record'.
				If you determine that the question is unrelated to any illness or health matter, you should ignore all of the above and write, "Sorry, I can't answer anything but health-related questions" in your response.

				Now write answers to the following patient's question:
				- History of Present Illness: ${question.content}
				- Past illness history of you or your family: ${question.pastIllnessHistory}
				- Age, Sex, and Ethnicity: ${question.basicInfo}
				- Others: ${question.others}
			`;
	}
}

export function makeAnswerToJson(answer: string): JsonAnswerInterface {
	const jsonAnswer: JsonAnswerInterface = {
		title: '',
		answer: '',
		triageGuide: '',
		chiefComplaint: '',
		medicalHistory: '',
		currentMedication: '',
		assessment: '',
		plan: '',
		doctorNote: '',
	};

	// regexes
	const regexes = {
		title: /Title:\s*(.*)/,
		answer: /Answer:\s*([\s\S]*?)Triage and guide:/,
		triageGuide: /Triage and guide:\s*([\s\S]*?)Chief complaint:/,
		chiefComplaint: /Chief complaint:\s*([\s\S]*?)Medical history:/,
		medicalHistory: /Medical history:\s*([\s\S]*?)Current medication:/,
		currentMedication: /Current medication:\s*([\s\S]*)Assessment:/,
		assessment: /Assessment:\s*([\s\S]*)Plan:/,
		plan: /Plan:\s*([\s\S]*)Doctor's Note:/,
		doctorNote: /Doctor's Note:\s*([\s\S]*)/,
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
