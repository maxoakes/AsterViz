/** @module SeedManager */
import {UserSeed} from "./user_seeder";
import {Seeder} from "../../lib/seed_manager";
import { AsteroidSeed } from "./asteroid_seeder";
import { ClassificationSeed } from "./classification_seeder";

export type SeederOptionsType = {
	seeds: Array<Seeder>;
}

/**
 * Options bag for configuring which seeds to run during `pnpm seed`
 */
const SeederOptions: any = {
	seeds: [
		UserSeed,
		ClassificationSeed,
		AsteroidSeed
	]
};

export default SeederOptions;