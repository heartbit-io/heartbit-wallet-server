import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableIndex,
	TableColumn,
	TableForeignKey,
} from 'typeorm';
import {UserRoles} from '../util/enums/userRoles';

export class User1687254835212 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{
						name: 'pubkey',
						type: 'varchar',
					},
					{
						name: 'email',
						type: 'varchar',
						isUnique: true,
					},
					{
						name: 'role',
						type: 'enum',
						enum: [...Object.values(UserRoles)],
						default: "'user'",
					},
					{
						name: 'btcBalance',
						type: 'numeric',
						default: 0,
					},
					{
						name: 'airTableRecordId',
						type: 'varchar',
						isUnique: true,
						isNullable: true,
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
		await queryRunner.dropTable('users');
	}
}
