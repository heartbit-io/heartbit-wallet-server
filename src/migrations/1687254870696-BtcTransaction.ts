import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class BtcTransaction1687254870696 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'btc_transactions',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{
						name: 'amount',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'fee',
						type: 'numeric',
						isNullable: false,
					},
					{
						name: 'from_user_pubkey',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'to_user_pubkey',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'created_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'timestamp',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'deleted_at',
						type: 'timestamp',
						isNullable: true,
					},
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('btc_transactions');
	}
}
