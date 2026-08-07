import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1786089866483 implements MigrationInterface {
    name = 'Init1786089866483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Store_Records" DROP CONSTRAINT "UQ_53a02e2ea1e92629e4029139c54"`);
        await queryRunner.query(`ALTER TYPE "public"."Store_Records_store_name_enum" RENAME TO "store_name_enum"`);
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" ALTER COLUMN "uuid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" ALTER COLUMN "uuid" SET DEFAULT gen_random_uuid()`);
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" ALTER COLUMN "expires_at" SET DEFAULT (CURRENT_TIMESTAMP + INTERVAL '15 minutes')`);
        await queryRunner.query(`ALTER TABLE "Store_Records" ADD CONSTRAINT "UQ_53a02e2ea1e92629e4029139c54" UNIQUE ("product_id", "store_name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Store_Records" DROP CONSTRAINT "UQ_53a02e2ea1e92629e4029139c54"`);
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" ALTER COLUMN "expires_at" SET DEFAULT (CURRENT_TIMESTAMP + '00:15:00')`);
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" ALTER COLUMN "uuid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" ALTER COLUMN "uuid" SET DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TYPE "public"."store_name_enum" RENAME TO "Store_Records_store_name_enum"`);
        await queryRunner.query(`ALTER TABLE "Store_Records" ADD CONSTRAINT "UQ_53a02e2ea1e92629e4029139c54" UNIQUE ("store_name", "product_id")`);
    }

}
