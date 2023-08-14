import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	OneToOne,
	JoinColumn,
} from 'typeorm';
import {User} from './User';

@Entity('doctor_profile')
export class DoctorProfile {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'int', nullable: false})
	userId: number;

	@Column({type: 'varchar', nullable: false})
	firstName: string;

	@Column({type: 'varchar', nullable: false})
	lastName: string;

	@OneToOne(() => User, user => user.doctorProfile)
	@JoinColumn({name: 'userId'})
	user: User;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;
}

export interface DoctorProfileAttributes {
	id?: number;
	userId: number;
	firstName: string;
	lastName: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}
