import {MigrationInterface, QueryRunner, Table} from 'typeorm';
import {ReplyStatus} from '../util/enums';

export class Reply1687254857707 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'replies',
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
						name: 'question_id',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'content',
						type: 'text',
						isNullable: false,
					},
					{
						name: 'status',
						type: 'enum',
						enum: [...Object.values(ReplyStatus)],
						default: "'done'",
					},
					{
						name: 'major_complaint',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'current_medications',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'assessment',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'medical_history',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'plan',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'triage',
						type: 'text',
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
					{
						name: 'translated_content',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'translated_title',
						type: 'text',
						isNullable: true,
					},
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('replies');
	}
}
