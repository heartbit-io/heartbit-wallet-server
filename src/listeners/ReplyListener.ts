import ReplyEvent from '../events/ReplyEvent';
import DeeplService from '../services/DeeplService';
import {DoctorReplyEventTypes} from '../types/eventTypes';
import ReplyRepository from '../Repositories/ReplyRepository';
import {mockTranslatedContent} from '../util/mockData';

const replyEventListener = new ReplyEvent();

const onDoctorReplyEvent = async (reply: DoctorReplyEventTypes) => {
	const translatedTitle =
		process.env.NODE_ENV === 'test'
			? mockTranslatedContent().translatedTitle
			: await DeeplService.getTextTranslatedIntoEnglish(
					reply.title,
					reply.language,
			  );

	const translatedDoctorNote =
		process.env.NODE_ENV === 'test'
			? mockTranslatedContent().translatedDoctorNote
			: await DeeplService.getTextTranslatedIntoEnglish(
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
