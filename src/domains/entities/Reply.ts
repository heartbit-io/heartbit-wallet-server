import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	UpdateDateColumn,
	CreateDateColumn,
	DeleteDateColumn,
} from 'typeorm';
import {ReplyStatus} from '../../util/enums/replyStatus';
import {User} from './User';
import {Question} from './Question';

@Entity('replies')
export class Reply {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'int'})
	userId: number;

	@Column({type: 'text'})
	title: string;

	@Column({type: 'text'})
	content: string;

	@Column({type: 'enum', enum: ReplyStatus, default: ReplyStatus.DONE})
	status: ReplyStatus;

	@Column({type: 'text', nullable: true})
	majorComplaint: string;

	@Column({type: 'text'})
	currentMedications: string;

	@Column({type: 'text'})
	assessment: string;

	@Column({type: 'text'})
	plan: string;

	@Column({type: 'text'})
	presentIllness: string;

	@Column({type: 'text'})
	pastMedicalHistory: string;

	@Column({type: 'text'})
	doctorNote: string;

	@Column({type: 'text'})
	triage: string;

	@Column({type: 'int'})
	questionId: number;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;

	@ManyToOne(() => User, user => user.replies)
	user: User;

	@ManyToOne(() => Question, question => question.replies)
	question: Question;

	@Column({type: 'text', nullable: true})
	translated_content: string;

	@Column({type: 'text', nullable: true})
	translated_title: string;
}

export interface RepliesAttributes {
	id?: number;
	questionId: number;
	userId: number;
	title: string;
	content: string;
	status: ReplyStatus;
	majorComplaint: string;
	presentIllness: string;
	pastMedicalHistory: string;
	currentMedications: string;
	assessment: string;
	plan: string;
	triage: string;
	lifestyle: string;
	doctorNote: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	translated_content?: string;
	translated_title?: string;
}
