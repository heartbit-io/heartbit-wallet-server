import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import {QuestionStatus, QuestionTypes} from '../../util/enums';
import {User} from './User';

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

	@JoinColumn({name: 'user_id'})
	@ManyToOne(() => User, user => user.questions)
	user: User;
}
