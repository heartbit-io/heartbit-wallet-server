import {MigrationInterface, QueryRunner, Table} from 'typeorm';
import {QuestionStatus, QuestionTypes} from '../util/enums';

export class Question1687254847493 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'questions',
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
						name: 'content',
						type: 'text',
						isNullable: false,
					},
					{
						name: 'raw_content_language',
						type: 'varchar',
					},
					{
						name: 'raw_content',
						type: 'text',
					},
					{
						name: 'bounty_amount',
						type: 'numeric',
						default: 0,
					},
					{
						name: 'status',
						type: 'enum',
						enum: [...Object.values(QuestionStatus)],
						default: "'open'",
					},
					{
						name: 'type',
						type: 'enum',
						enum: [...Object.values(QuestionTypes)],
						default: "'general'",
					},
					{
						name: 'current_medication',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'age_sex_ethnicity',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'past_illness_history',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'others',
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
				],
			}),
			true,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('questions');
	}
}
