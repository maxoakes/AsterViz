/** @module Seeds/User */
import fs from 'fs';
import { parse } from 'csv-parse';
import {Seeder} from "../../lib/seed_manager";
import {FastifyInstance} from "fastify";
import { Classification } from "../models/classification";


/**
 * UserSeeder class - Model class for interacting with "users" table
 */
export class ClassificationSeeder extends Seeder {
	/**
	 * Runs the IPHistory table's seed
	 * @function
	 * @param {FastifyInstance} app
	 * @returns {Promise<void>}
	 */
	override async run(app: FastifyInstance) {
		app.log.info("Seeding Classifications...");
		await app.db.classification.delete({});

		const parser = fs.createReadStream('./src/db/seeds/classes.csv')
			.pipe(parse({delimiter: ',', from: 2}));

		for await (const row of parser)
		{
			let newClass = new Classification();
			newClass.abbreviation = row[1];
			newClass.name = row[2];
			newClass.description = row[3];
			await newClass.save();
			app.log.info(`\tSeeded ${newClass.abbreviation}`);
		}
		app.log.info(`Done Seeding Classifications`);
	}
}

// generate default instance for convenience
export const ClassificationSeed = new ClassificationSeeder();