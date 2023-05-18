import {JsonAnswerInterface} from '../models/ChatgptReplyModel';

// TODO(david): Consider the patient's profile
export function makePrompt(prompt: string, patientProfile: string): string {
	return `
		You are an experienced licensed doctor. I will show you a patient's case.

		After getting enough information, first organize the patient's description titled 'Health record' in a clinical record format categorized into 'Title', 'Triage and guide', a 'Chief complaint', 'Medical history', 'Current medication', 'Assessment', and 'Plan' with detailed and bullet-pointed contents, but you SHOULD NOT include the patient's profile information in the 'Medical history'.'Title' should be derived from the 'Chief Complaint'. And 'Triage and guide' should include triage of the patient's case and an explanation of what simple symptomatic treatment can be done at home in the patient's case and what kind of condition it is best to visit the hospital. Please make sure to fill out the 'Triage and guide' field.
				
		Second, write a kind note titled 'Doctor's note' to the patient, including a summary of the 'Heath record'.
		Now write answers to the following patient's story:
		- Consider the patient's profile: ${patientProfile} 
		- Patient's description: ${prompt}
				
		Comments
		Both patient's profile and question should be translated into English (if not English) before inserted into prompt
		Profile information is imported from the user's account information.
		
		Example
		Consider the patient's profile; 65 years old, male, indian, US citizen, living in the US, 175cm tall, and 72kg. 
		Patient's description: I have early cataracts. I've been taking MTX steroid 1.5 tablets for 2 weeks now for arthritis, is it okay to take it? I'm scared because my eyes feel like they've gotten worse.
    `;
}

export function makeAnswerToJson(answer: string): JsonAnswerInterface {
	const jsonAnswer: JsonAnswerInterface = {
		title: '',
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
		triageGuide: /Triage and guide:\s*([\s\S]*?)Chief complaint:/,
		chiefComplaint: /Chief complaint:\s*([\s\S]*?)Medical history:/,
		medicalHistory: /Medical history:\s*([\s\S]*?)Current medication:/,
		currentMedication: /Current medication:\s*([\s\S]*)assessment:/,
		assessment: /assessment:\s*([\s\S]*)Plan:/,
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
