import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	DeleteDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import {User} from './User';
import {TxTypes} from '../../util/enums';

@Entity('btc_transactions')
export class BtcTransaction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type: 'numeric', default: 0})
	amount: number;

	@Column({
		type: 'enum',
		enum: TxTypes,
	})
	type: TxTypes;

	@Column({type: 'numeric'})
	fee: number;

	@Column()
	fromUserPubkey: string;

	@Column()
	toUserPubkey: string;

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

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date | null;
}

export interface BtcTransactionFields {
	id?: number;
	amount: number;
	type: TxTypes;
	fee: number;
	fromUserPubkey: string;
	toUserPubkey: string;
}
