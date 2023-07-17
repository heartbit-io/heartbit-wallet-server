import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('doctor_question')
export class DoctorQuestion {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'int', nullable: false})
	doctorId: number;

	@Column({type: 'int', nullable: false})
	questionId: number;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;
}

export interface DoctorQuestionAttributes {
	id?: number;
	doctorId: number;
	questionId: number;
}
