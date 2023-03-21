/** @module Models/Classification */
import TypeORM from "typeorm";

import {Asteroid} from "./asteroid";

@TypeORM.Entity({name: "classifications"})
export class Classification extends TypeORM.BaseEntity {
	@TypeORM.PrimaryGeneratedColumn()
	id: number;

	@TypeORM.Column()
	abbreviation: string;

	@TypeORM.Column()
	name: string;

	@TypeORM.Column()
	description: string;

	// Asteroids
	@TypeORM.OneToMany((type) => Asteroid, (asteroid: Asteroid) => asteroid)
	asteroids: TypeORM.Relation<Asteroid[]>;
}
