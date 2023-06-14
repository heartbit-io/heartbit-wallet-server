import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToOne,
	JoinColumn,
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

	@OneToOne(() => Question, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({
		name: 'question_id',
		referencedColumnName: 'question_id',
	})
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
