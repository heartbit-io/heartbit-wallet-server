import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import {Question} from './Question';

export interface JsonAnswerInterface {
	[title: string]: string;
	aiAnswer: string;
	doctorAnswer: string;
	guide: string;
	chiefComplaint: string;
	medicalHistory: string;
	currentMedication: string;
	assessment: string;
	plan: string;
	doctorNote: string;
}

export interface ChatGptReplyAttributes {
	id?: number;
	questionId?: number;
	model: string;
	maxTokens: number;
	prompt: string;
	rawAnswer: string;
	jsonAnswer: JsonAnswerInterface;
}

@Entity('chatgpt_replies')
export class ChatGptReply {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	questionId: number;

	@Column()
	model: string;

	@Column()
	maxTokens: number;

	@Column({type: 'text'})
	prompt: string;

	@Column({type: 'text'})
	rawAnswer: string;

	@Column('json', {nullable: false, default: {}})
	jsonAnswer: JsonAnswerInterface;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date | null;

	@OneToOne(() => Question, question => question.chatGptReply)
	@JoinColumn({name: 'questionId'})
	question: Question;
}
