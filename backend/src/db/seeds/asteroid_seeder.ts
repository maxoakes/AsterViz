/** @module Seeds/Asteroid */

import fs from 'fs';
import { parse } from 'csv-parse';
import {faker} from "@faker-js/faker";
import {Seeder} from "../../lib/seed_manager";
import {User} from "../models/user";
import {FastifyInstance} from "fastify";
import { Asteroid } from "../models/asteroid";
import { Classification } from '../models/classification';

// note here that using faker makes testing a bit...hard
// We can set a particular seed for faker, then use it later in our testing!
faker.seed(100);

/**
 * Seeds the ip_history table
 */
export class AsteroidSeeder extends Seeder {

	/**
	 * Runs the Profile table's seed
	 * @function
	 * @param {FastifyInstance} app
	 * @returns {Promise<void>}
	 */
	override async run(app: FastifyInstance) {
		app.log.info("Seeding Asteroids. This may take a while...");
		// Remove everything in there currently
		await app.db.asteroid.delete({});

		const parser = fs.createReadStream('./src/db/seeds/asteroids-short.csv')
			.pipe(parse({delimiter: ',', from: 2}));

		for await (const row of parser)
		{
			try
			{
				let newClass = new Asteroid();
				newClass.spkid = row[0];
				newClass.full_name = row[1];
				newClass.pdes = row[2];
				newClass.fancy_name = row[3];
				newClass.neo = row[4];
				newClass.pha = row[5];
				newClass.absmag = row[6] === 'NULL' ? null : row[6];
				newClass.diameter = row[7];
				newClass.albedo = row[8] === 'NULL' ? null : row[8];
				newClass.eccentricity = row[9];
				newClass.semimajor_axis = row[10];
				newClass.perihelion = row[11];
				newClass.inclination = row[12];
				newClass.asc_node_long = row[13];
				newClass.arg_periapsis = row[14];
				newClass.mean_anomaly = row[15];
				newClass.classification = await Classification.findOneOrFail({
					where: {
						id: row[16]
					}
				});
				newClass.creator = await User.findOneByOrFail({})
				await newClass.save();
				if (newClass.id % 100 == 0)
				{
					app.log.info(`\tSeeded Asteroid no. ${newClass.id}: ${newClass.full_name}`);
				}
			}
			catch(error)
			{
				app.log.error(row);
				app.log.error(error)
			}
		}
		app.log.info(`Done Seeding Asteroids`);
	}
}

export const AsteroidSeed = new AsteroidSeeder();