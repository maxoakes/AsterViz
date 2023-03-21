/** @module Seeds/Minio */

import fs from 'fs';
import {Seeder} from "../../lib/seed_manager";
import {FastifyInstance} from "fastify";
import { deleteAllMinioFiles, UploadFileToMinio } from '../../lib/minio';

export class MinioSeeder extends Seeder {

	/**
	 * Runs the Profile table's seed
	 * @function
	 * @param {FastifyInstance} app
	 * @returns {Promise<void>}
	 */
	override async run(app: FastifyInstance) {
		app.log.info("Seeding Planet Textures");
		
		// looks like we do not need to delete them before they are re-seeded. uploading a file overwrites any exisitng of the same file
		// await deleteAllMinioFiles();

		let dirname = "./src/db/seeds/textures/"
		let links = [
			"http://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_venus_atmosphere.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_mars.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_jupiter.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_uranus.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
			"http://www.solarsystemscope.com/textures/download/2k_sun.jpg",
			"http://static.wikia.nocookie.net/planet-texture-maps/images/6/64/Pluto_Made.png",
		];
		fs.readdir(dirname, function(err, filenames)
		{
			filenames.forEach(function(filename)
			{
				fs.readFile(dirname + filename, async function(err, content)
				{
					await UploadFileToMinio(filename, content);
			  	});
			});
		});
		app.log.info(`Done Seeding Planet Textures to MinIO`);
	}
}

export const MinioSeed = new MinioSeeder();