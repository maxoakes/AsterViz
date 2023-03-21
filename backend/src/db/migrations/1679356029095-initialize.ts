import { MigrationInterface, QueryRunner } from "typeorm";

export class initialize1679356029095 implements MigrationInterface {
    name = 'initialize1679356029095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "classifications" ("id" SERIAL NOT NULL, "abbreviation" character varying NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_58d976e264f75fc0ea006718856" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asteroids" ("id" SERIAL NOT NULL, "spkid" character varying NOT NULL, "full_name" character varying NOT NULL, "fancy_name" character varying NOT NULL, "pdes" character varying NOT NULL, "neo" boolean NOT NULL, "pha" boolean NOT NULL, "absmag" double precision, "diameter" double precision NOT NULL, "albedo" double precision, "eccentricity" double precision NOT NULL, "semimajor_axis" double precision NOT NULL, "perihelion" double precision NOT NULL, "inclination" double precision NOT NULL, "asc_node_long" double precision NOT NULL, "arg_periapsis" double precision NOT NULL, "mean_anomaly" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "classificationId" integer, "creatorId" integer, CONSTRAINT "PK_8e303e7ef704d4f467edf9c7660" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "asteroids" ADD CONSTRAINT "FK_8ba9d414a8c22bcef17a9058fc5" FOREIGN KEY ("classificationId") REFERENCES "classifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "asteroids" ADD CONSTRAINT "FK_46feff7cab147221890ed0ecf24" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "asteroids" DROP CONSTRAINT "FK_46feff7cab147221890ed0ecf24"`);
        await queryRunner.query(`ALTER TABLE "asteroids" DROP CONSTRAINT "FK_8ba9d414a8c22bcef17a9058fc5"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "asteroids"`);
        await queryRunner.query(`DROP TABLE "classifications"`);
    }

}
