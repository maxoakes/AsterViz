/** @module Models/Classification */
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

@Entity({name: "classifications"})
export class Classification extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	abbreviation: string;

	@Column()
	name: string;

	@Column()
	description: string;

	// Asteroids
	@OneToMany((type) => Asteroid, (asteroid: Asteroid) => asteroid)
	asteroids: Relation<Asteroid[]>;
}
