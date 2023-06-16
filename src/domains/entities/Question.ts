import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	OneToOne,
	OneToMany,
} from 'typeorm';
import {QuestionStatus, QuestionTypes} from '../../util/enums';
import {User} from './User';
import {ChatGptReply} from './ChatGptReply';
import {Reply} from './Reply';

@Entity('questions')
export class Question {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'text'})
	content: string;

	@Column()
	rawContentLanguage: string;

	@Column({type: 'text'})
	rawContent: string;

	@Column()
	userId: number;

	@Column({type: 'double', default: 0})
	bountyAmount: number;

	@Column({
		type: 'enum',
		enum: [...Object.values(QuestionStatus)],
		default: QuestionStatus.OPEN,
	})
	status: string;

	@Column({
		type: 'enum',
		enum: [...Object.values(QuestionTypes)],
	})
	type: string;

	@Column({type: 'text'})
	currentMedication: string;

	@Column({type: 'text'})
	ageSexEthnicity: string;

	@Column({type: 'text'})
	pastIllnessHistory: string;

	@Column({type: 'text'})
	others: string;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;

	@OneToOne(() => ChatGptReply, chatGptReply => chatGptReply.question)
	chatGptReply: ChatGptReply;

	@ManyToOne(() => User, user => user.questions)
	user: User;

	@OneToMany(() => Reply, reply => reply.user)
	replies: Reply[];

	dataValues: any;
}

export interface QuestionAttributes {
	id?: number;
	totalBounty?: unknown;
	content: string;
	rawContentLanguage: string;
	rawContent: string;
	userId: number;
	bountyAmount: number;
	status?: QuestionStatus;
	type?: QuestionTypes;
	currentMedication?: string;
	ageSexEthnicity?: string;
	pastIllnessHistory?: string;
	others?: string;
}
