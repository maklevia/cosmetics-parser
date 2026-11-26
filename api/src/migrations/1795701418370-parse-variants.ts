import { MigrationInterface, QueryRunner } from "typeorm";

export class ParseVariants1795701418370 implements MigrationInterface {
    name = 'ParseVariants1795701418370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Store_Records" DROP CONSTRAINT "UQ_53a02e2ea1e92629e4029139c54"`);
        await queryRunner.query(`ALTER TABLE "Store_Records" ADD COLUMN "variant_id" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "Store_Records" ADD COLUMN "options" jsonb`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_store_record_store_variant" ON "Store_Records" ("store_name", "variant_id") WHERE "variant_id" IS NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_store_record_link" ON "Store_Records" ("link")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_store_record_link"`);
        await queryRunner.query(`DROP INDEX "UQ_store_record_store_variant"`);
        await queryRunner.query(`ALTER TABLE "Store_Records" DROP COLUMN "options"`);
        await queryRunner.query(`ALTER TABLE "Store_Records" DROP COLUMN "variant_id"`);
        await queryRunner.query(`ALTER TABLE "Store_Records" ADD CONSTRAINT "UQ_53a02e2ea1e92629e4029139c54" UNIQUE ("product_id", "store_name")`);
    }

}
