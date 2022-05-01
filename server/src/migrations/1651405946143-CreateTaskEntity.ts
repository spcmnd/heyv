import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskEntity1651405946143 implements MigrationInterface {
  name = 'CreateTaskEntity1651405946143';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`task\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`occurrence\` int NOT NULL, \`periodicity\` varchar(255) NOT NULL, \`doneCount\` int NOT NULL DEFAULT '0', \`dueDate\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`task\``);
  }
}
