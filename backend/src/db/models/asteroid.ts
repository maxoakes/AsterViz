/** @module Models/Asteroid */
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity, JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation
} from "typeorm";
import { User } from "./user";
import { Classification } from "./classification";

@Entity({name: "asteroids"})
export class Asteroid extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	//SPK-ID
	@Column()
	spkid: string;

	//Object full name/designation
	@Column()
	full_name: string;

	//Object IAU name
	@Column()
	fancy_name: string;

	// Object primary designation
	@Column()
	pdes: string;

	// Is near-Earth Object
	@Column()
	neo: Boolean;

	// Is potentially hazardous object
	@Column()
	pha: Boolean;

	// Absolute Magnitude
	@Column("float", {nullable: true})
	absmag: Number | null;

	// Diameter (km)
	@Column("float")
	diameter: Number;

	// Albedo
	@Column("float", {nullable: true})
	albedo: Number | null;

	@Column("float")
	eccentricity: Number;

	// Semi Major-axis (AU)
	@Column("float")
	semimajor_axis: Number;

	// Perihelion (AU)
	@Column("float")
	perihelion: Number;

	// Inclination (deg)
	@Column("float")
	inclination: Number;

	// Ascending Node Longitude
	@Column("float")
	asc_node_long: Number;

	// Arg of Periapsis (deg)
	@Column("float")
	arg_periapsis: Number;

	// Mean Anomaly (deg)
	@Column("float")
	mean_anomaly: Number;

	@ManyToOne((type) => Classification, (classification: Classification) => classification, {
		//adding an IPHistory will also add associated User if it is new, somewhat useless in this example
		cascade: true,
		// if we delete a User, also delete their IP History
		onDelete: "CASCADE"
	})
	classification: Relation<Classification>;

	@ManyToOne((type) => User, (user: User) => user, {
		//adding an IPHistory will also add associated User if it is new, somewhat useless in this example
		cascade: true,
		// if we delete a User, also delete their IP History
		onDelete: "CASCADE"
	})
	creator: Relation<User>;

	@CreateDateColumn()
	created_at: string;
}