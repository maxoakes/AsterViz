/** @module Models/User */
import { hashSync } from "bcrypt";
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn
} from "typeorm";

import {Asteroid} from "./asteroid";

/**
 *  Class representing user table
 */
@Entity({name: "users"})
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column('text')
	email: string;

	@Column({type: "text", default: hashSync("password", 2)})
	password!: string;

	// Asteroids
	@OneToMany((type) => Asteroid, (asteroid: Asteroid) => asteroid)
	asteroids: Relation<Asteroid[]>;

	@CreateDateColumn()
	created_at: string;

	@UpdateDateColumn()
	updated_at: string;
}
