import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class ChatGptReply1687254887070 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'chatgpt_replies',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
					},
					{
						name: 'question_id',
						type: 'int',
						isNullable: false,
					},
					{
						name: 'model',
						type: 'varchar',
						isNullable: true,
					},
					{
						name: 'prompt',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'raw_answer',
						type: 'text',
						isNullable: true,
					},
					{
						name: 'json_answer',
						type: 'json',
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
		await queryRunner.dropTable('chatgpt_replies');
	}
}
