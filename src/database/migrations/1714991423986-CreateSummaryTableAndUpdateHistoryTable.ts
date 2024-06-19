import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSummaryTableAndUpdateHistoryTable1714991423986
  implements MigrationInterface
{
  name = 'CreateSummaryTableAndUpdateHistoryTable1714991423986';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "summary" ("id" SERIAL NOT NULL, "textInput" character varying, "fileInput" character varying, "length" integer NOT NULL, "dataPDF" character varying NOT NULL, CONSTRAINT "PK_406f24bdfa7fbb014243f5f8571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "history" ADD "summaryId" integer`);
    await queryRunner.query(
      `ALTER TABLE "history" ADD CONSTRAINT "UQ_b648d22a74c3117b9a42bdbba8a" UNIQUE ("summaryId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "history" ADD CONSTRAINT "FK_b648d22a74c3117b9a42bdbba8a" FOREIGN KEY ("summaryId") REFERENCES "summary"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "FK_b648d22a74c3117b9a42bdbba8a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "history" DROP CONSTRAINT "UQ_b648d22a74c3117b9a42bdbba8a"`,
    );
    await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "summaryId"`);
    await queryRunner.query(`DROP TABLE "summary"`);
  }
}
