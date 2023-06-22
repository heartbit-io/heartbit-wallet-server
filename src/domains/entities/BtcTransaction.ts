import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import {User} from './User';
import {TxTypes} from '../../util/enums';

@Entity('btc_transactions')
export class BtcTransaction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	amount: number;

	@Column({
		type: 'enum',
		enum: TxTypes,
	})
	type: TxTypes;

	@Column()
	fee: number;

	@Column()
	fromUserPubkey: string;

	@Column()
	toUserPubkey: string;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;

	@ManyToOne(() => User, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({
		name: 'from_user_pubkey',
		referencedColumnName: 'pubkey',
	})
	FromUser: User;

	@ManyToOne(() => User, {
		createForeignKeyConstraints: false,
	})
	@JoinColumn({
		name: 'to_user_pubkey',
		referencedColumnName: 'pubkey',
	})
	ToUser: User;
}

export interface BtcTransactionFields {
	id?: number;
	amount: number;
	type: TxTypes;
	fee: number;
	fromUserPubkey: string;
	toUserPubkey: string;
}
