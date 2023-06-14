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

@Entity()
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

	@Column({type: 'json'})
	jsonAnswer: string;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;

	@OneToOne(() => Question, question => question.chatGptReply)
	question: Question;
}

export interface ChatGptReplyFields {
	id?: number;
	questionId: number;
	model: string;
	maxTokens: number;
	prompt: string;
	rawAnswer: string;
	jsonAnswer: string;
}
