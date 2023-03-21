/** @module Models/User */
import { hashSync } from "bcrypt";
import TypeORM from "typeorm";

import {Asteroid} from "./asteroid";

/**
 *  Class representing user table
 */
@TypeORM.Entity({name: "users"})
export class User extends TypeORM.BaseEntity {
	@TypeORM.PrimaryGeneratedColumn()
	id: number;

	@TypeORM.Column()
	name: string;

	@TypeORM.Column('text')
	email: string;

	// Asteroids
	@TypeORM.OneToMany((type) => Asteroid, (asteroid: Asteroid) => asteroid)
	asteroids: TypeORM.Relation<Asteroid[]>;

	@TypeORM.CreateDateColumn()
	created_at: string;

	@TypeORM.UpdateDateColumn()
	updated_at: string;
}
