import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	JoinColumn,
	UpdateDateColumn,
	CreateDateColumn,
	DeleteDateColumn,
} from 'typeorm';
import {UserRoles} from '../../util/enums';
import {Question} from './Question';

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({unique: true})
	pubkey: string;

	@Column({unique: true})
	email: string;

	@Column({
		type: 'enum',
		enum: UserRoles,
		default: UserRoles.USER,
	})
	role: UserRoles;

	@Column()
	btcBalance: number;

	@Column({nullable: true, unique: true})
	airTableRecordId: string;

	@OneToMany(() => Question, question => question.user)
	questions: Question[];

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;
}

export interface UserFields {
	id?: number;
	pubkey: string;
	email: string;
	role: UserRoles;
	btcBalance: number;
	airTableRecordId?: string;
}
