import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1786090359648 implements MigrationInterface {
    name = 'Init1786090359648'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Store_Records_Overrides" ("id" SERIAL NOT NULL, "latest_price" integer, "in_stock" boolean NOT NULL DEFAULT false, "hidden" boolean NOT NULL DEFAULT false, "custom_url" character varying(500), "parsed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "user_id" integer, "store_record_id" integer, CONSTRAINT "UQ_31ce4ccecdd2ad5c1bd00f4f4f4" UNIQUE ("user_id", "store_record_id"), CONSTRAINT "PK_0102423a98da4a461d0153c8e37" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Price_History_store_name_enum" AS ENUM('makeup', 'eva', 'notino')`);
        await queryRunner.query(`CREATE TABLE "Price_History" ("id" SERIAL NOT NULL, "store_name" "public"."Price_History_store_name_enum" NOT NULL, "price" integer, "in_stock" boolean NOT NULL DEFAULT false, "recorded_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "store_record_id" integer, CONSTRAINT "PK_fb790cb697d168d4c83b06dc2e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Price_Drop_Queue_status_enum" AS ENUM('pending', 'processed')`);
        await queryRunner.query(`CREATE TABLE "Price_Drop_Queue" ("id" SERIAL NOT NULL, "old_price" integer, "new_price" integer, "status" "public"."Price_Drop_Queue_status_enum" NOT NULL DEFAULT 'pending', "batch_id" character varying(16), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "store_record_id" integer, "product_id" integer, CONSTRAINT "PK_2d36e72b9d8d396cdc8810f29f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."store_name_enum" AS ENUM('makeup', 'eva', 'notino')`);
        await queryRunner.query(`CREATE TABLE "Store_Records" ("id" SERIAL NOT NULL, "store_name" "public"."store_name_enum" NOT NULL, "product_store_name" character varying(255) NOT NULL, "link" text NOT NULL, "image" text, "latest_price" integer, "in_stock" boolean NOT NULL DEFAULT false, "parsed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "product_id" integer, CONSTRAINT "UQ_53a02e2ea1e92629e4029139c54" UNIQUE ("product_id", "store_name"), CONSTRAINT "PK_f5e4163b25f595eec81245fd8ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "User_Notifications" ("id" SERIAL NOT NULL, "title" text, "message" text NOT NULL, "image" text, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "product_id" integer, CONSTRAINT "PK_32a83023632f849a55ffd87d8b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Products" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "brand" character varying(255) NOT NULL, "image" text, "primary_store_name" "public"."store_name_enum", "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_36a07cc432789830e7fb7b58a83" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Collections" ("id" SERIAL NOT NULL, "notify_on_price_drop" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, "product_id" integer, CONSTRAINT "PK_d26a225e716bb5c7c28c7425291" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Channel_Tokens_channel_enum" AS ENUM('telegram')`);
        await queryRunner.query(`CREATE TABLE "Channel_Tokens" ("id" SERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT gen_random_uuid(), "channel" "public"."Channel_Tokens_channel_enum", "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '15 minutes'), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_80064cea8e7211e428b069cccf9" UNIQUE ("uuid"), CONSTRAINT "PK_619ff71706328b6e65b39b90678" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "name" character varying(25), "telegram_account_id" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "UQ_c54abe791608dbe4f633558a5c8" UNIQUE ("telegram_account_id"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "Store_Records_Overrides" ADD CONSTRAINT "FK_0b4c552f85cd7255a9bea073b6b" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Store_Records_Overrides" ADD CONSTRAINT "FK_a283d7fb0a2528f87280c9329fd" FOREIGN KEY ("store_record_id") REFERENCES "Store_Records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Price_History" ADD CONSTRAINT "FK_830ee6717024e19f4314763b6b8" FOREIGN KEY ("store_record_id") REFERENCES "Store_Records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Price_Drop_Queue" ADD CONSTRAINT "FK_261795a905fc88d4b6a782b32d0" FOREIGN KEY ("store_record_id") REFERENCES "Store_Records"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Price_Drop_Queue" ADD CONSTRAINT "FK_f570e36a86964e5ecf3b0882d3e" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Store_Records" ADD CONSTRAINT "FK_72a0c7aa41cfe5427e197102232" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User_Notifications" ADD CONSTRAINT "FK_65ae043458b380dcc0a2bbb18d3" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "User_Notifications" ADD CONSTRAINT "FK_6d68f3fddb93d49effedb0001e5" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Collections" ADD CONSTRAINT "FK_334ae7148e43ebcd16b35fb15c3" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Collections" ADD CONSTRAINT "FK_083ee0010229a136d83d37ed48c" FOREIGN KEY ("product_id") REFERENCES "Products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" ADD CONSTRAINT "FK_20932f8ebe625cf472a68fc1ee6" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Channel_Tokens" DROP CONSTRAINT "FK_20932f8ebe625cf472a68fc1ee6"`);
        await queryRunner.query(`ALTER TABLE "Collections" DROP CONSTRAINT "FK_083ee0010229a136d83d37ed48c"`);
        await queryRunner.query(`ALTER TABLE "Collections" DROP CONSTRAINT "FK_334ae7148e43ebcd16b35fb15c3"`);
        await queryRunner.query(`ALTER TABLE "User_Notifications" DROP CONSTRAINT "FK_6d68f3fddb93d49effedb0001e5"`);
        await queryRunner.query(`ALTER TABLE "User_Notifications" DROP CONSTRAINT "FK_65ae043458b380dcc0a2bbb18d3"`);
        await queryRunner.query(`ALTER TABLE "Store_Records" DROP CONSTRAINT "FK_72a0c7aa41cfe5427e197102232"`);
        await queryRunner.query(`ALTER TABLE "Price_Drop_Queue" DROP CONSTRAINT "FK_f570e36a86964e5ecf3b0882d3e"`);
        await queryRunner.query(`ALTER TABLE "Price_Drop_Queue" DROP CONSTRAINT "FK_261795a905fc88d4b6a782b32d0"`);
        await queryRunner.query(`ALTER TABLE "Price_History" DROP CONSTRAINT "FK_830ee6717024e19f4314763b6b8"`);
        await queryRunner.query(`ALTER TABLE "Store_Records_Overrides" DROP CONSTRAINT "FK_a283d7fb0a2528f87280c9329fd"`);
        await queryRunner.query(`ALTER TABLE "Store_Records_Overrides" DROP CONSTRAINT "FK_0b4c552f85cd7255a9bea073b6b"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TABLE "Channel_Tokens"`);
        await queryRunner.query(`DROP TYPE "public"."Channel_Tokens_channel_enum"`);
        await queryRunner.query(`DROP TABLE "Collections"`);
        await queryRunner.query(`DROP TABLE "Products"`);
        await queryRunner.query(`DROP TABLE "User_Notifications"`);
        await queryRunner.query(`DROP TABLE "Store_Records"`);
        await queryRunner.query(`DROP TYPE "public"."store_name_enum"`);
        await queryRunner.query(`DROP TABLE "Price_Drop_Queue"`);
        await queryRunner.query(`DROP TYPE "public"."Price_Drop_Queue_status_enum"`);
        await queryRunner.query(`DROP TABLE "Price_History"`);
        await queryRunner.query(`DROP TYPE "public"."Price_History_store_name_enum"`);
        await queryRunner.query(`DROP TABLE "Store_Records_Overrides"`);
    }

}
