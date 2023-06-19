import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	UpdateDateColumn,
	CreateDateColumn,
	DeleteDateColumn,
} from 'typeorm';
import {UserRoles} from '../../util/enums';
import {Question} from './Question';
import {BtcTransaction} from './BtcTransaction';
import {Reply} from './Reply';

@Entity('users')
export class User {
	get(arg0: string): number {
		throw new Error('Method not implemented.');
	}
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

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;

	@OneToMany(() => Question, question => question.user)
	questions: Question[];

	@OneToMany(() => BtcTransaction, btcTransaction => btcTransaction.user)
	btcTransactions: BtcTransaction[];

	@OneToMany(() => Reply, reply => reply.user)
	replies: Reply[];

	dataValues: any;

	isDoctor() {
		return this.role === UserRoles.DOCTOR;
	}
}

export interface UserFields {
	id?: number;
	pubkey: string;
	email: string;
	role: UserRoles;
	btcBalance: number;
	airTableRecordId?: string;
}
