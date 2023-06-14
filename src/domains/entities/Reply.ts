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

	@Column({type: 'enum', enum: [...Object.values(ReplyStatus)]})
	status: string;

	@Column({type: 'text', nullable: true})
	majorComplaint: string;

	@Column({type: 'text'})
	currentMedications: string;

	@Column({type: 'text'})
	assessment: string;

	@Column({type: 'text'})
	plan: string;

	@Column({type: 'text'})
	medicalHistory: string;

	@Column({type: 'text'})
	triage: string;

	@Column({type: 'int'})
	questionId: number;
}
