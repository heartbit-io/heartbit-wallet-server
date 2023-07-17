import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
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

	@Column({type: 'numeric'})
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
