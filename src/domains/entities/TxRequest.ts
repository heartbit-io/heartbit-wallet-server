import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm';
import {User} from './User';

@Entity('tx_requests')
export class TxRequest {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	userId: number;

	@Column({type: 'double'})
	amount: number;

	@Column()
	secret: string;

	@Column()
	status: string;

	@CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	createdAt: Date;

	@UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
	updatedAt: Date;

	@DeleteDateColumn({type: 'timestamp', nullable: true})
	deletedAt: Date;

	@ManyToOne(() => User, user => user.txRequests)
	user: User;
}

export interface TxRequestInterface {
	id?: number;
	userId: number;
	amount: number;
	secret: string;
	status?: string;
}
