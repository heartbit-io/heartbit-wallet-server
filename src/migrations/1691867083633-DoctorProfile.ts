import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class DoctorProfile1691867083633 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'doctor_profile',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{
						name: 'user_id',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'first_name',
						type: 'varchar',
						isNullable: false,
					},
					{
						name: 'last_name',
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
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('doctor_profile');
	}
}
