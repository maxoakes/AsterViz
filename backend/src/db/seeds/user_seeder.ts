/** @module Seeds/User */
import {User} from "../models/user";
import {Seeder} from "../../lib/seed_manager";
import {FastifyInstance} from "fastify";

/**
 * UserSeeder class - Model class for interacting with "users" table
 */
export class UserSeeder extends Seeder {
	/**
	 * Runs the IPHistory table's seed
	 * @function
	 * @param {FastifyInstance} app
	 * @returns {Promise<void>}
	 */
	override async run(app: FastifyInstance) {
		app.log.info("Seeding Users...");
		await app.db.user.delete({});

		let user = new User();
		user.name = "Universe";
		user.email = "m.oakes017@gmail.com";
		await user.save();
		app.log.info("\tSeeded Universe user");
	}
}

// generate default instance for convenience
export const UserSeed = new UserSeeder();