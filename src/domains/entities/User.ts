import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import {Question} from './Question';
import {Reply} from './Reply';
import {UserRoles} from '../../util/enums';

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

	@Column({type: 'numeric', default: 0})
	btcBalance: number;

	@Column({nullable: true, unique: true})
	airTableRecordId: string;

	@Column({nullable: true, unique: true})
	fcmToken: string;

	@Column({type: 'numeric', default: 0})
	promotionBtcBalance: number;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;

	@OneToMany(() => Question, question => question.user)
	questions: Question[];

	@OneToMany(() => Reply, reply => reply.user)
	replies: Reply[];

	dataValues: any;

	isDoctor() {
		return this.role === UserRoles.DOCTOR;
	}

	isUser() {
		return this.role === UserRoles.USER;
	}

	isAdmin() {
		return this.role === UserRoles.ADMIN;
	}

	userExists() {
		return this.id !== undefined;
	}

	getUserDetails() {
		return {
			id: this.id,
			pubkey: this.pubkey,
			email: this.email,
			role: this.role,
			btcBalance: this.btcBalance,
			airTableRecordId: this.airTableRecordId,
		};
	}
}

export interface UserAttributes {
	id?: number;
	pubkey: string;
	email: string;
	role: UserRoles;
	btcBalance: number;
	fcmToken?: string;
	airTableRecordId?: string;
	promotionBtcBalance?: number;
}
