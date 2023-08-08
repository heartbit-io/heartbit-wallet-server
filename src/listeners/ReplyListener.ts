import ReplyEvent from '../events/ReplyEvent';
import DeeplService from '../services/DeeplService';
import {DoctorReplyEventTypes} from '../types/eventTypes';
import ReplyRepository from '../Repositories/ReplyRepository';

const replyEventListener = new ReplyEvent();

const onDoctorReplyEvent = async (reply: DoctorReplyEventTypes) => {
	const translatedTitle = await DeeplService.getTextTranslatedIntoEnglish(
		reply.title,
		reply.language,
	);

	const translatedDoctorNote = await DeeplService.getTextTranslatedIntoEnglish(
		reply.doctorNote,
		reply.language,
	);

	await ReplyRepository.updateReplyTranslatedContent(
		reply.replyId,
		translatedDoctorNote.text,
		translatedTitle.text,
	);
};

replyEventListener.on('questionAnsweredByDoctor', onDoctorReplyEvent);

export default replyEventListener;
