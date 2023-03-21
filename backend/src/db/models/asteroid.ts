/** @module Models/Asteroid */
import TypeORM from "typeorm";
import { User } from "./user";
import { Classification } from "./classification";

@TypeORM.Entity({name: "asteroids"})
export class Asteroid extends TypeORM.BaseEntity {
	@TypeORM.PrimaryGeneratedColumn()
	id: number;

	//SPK-ID
	@TypeORM.Column()
	spkid: string;

	//Object full name/designation
	@TypeORM.Column()
	full_name: string;

	//Object IAU name
	@TypeORM.Column()
	fancy_name: string;

	// Object primary designation
	@TypeORM.Column()
	pdes: string;

	// Is near-Earth Object
	@TypeORM.Column()
	neo: Boolean;

	// Is potentially hazardous object
	@TypeORM.Column()
	pha: Boolean;

	// Absolute Magnitude
	@TypeORM.Column("float", {nullable: true})
	absmag: Number | null;

	// Diameter (km)
	@TypeORM.Column("float")
	diameter: Number;

	// Albedo
	@TypeORM.Column("float", {nullable: true})
	albedo: Number | null;

	@TypeORM.Column("float")
	eccentricity: Number;

	// Semi Major-axis (AU)
	@TypeORM.Column("float")
	semimajor_axis: Number;

	// Perihelion (AU)
	@TypeORM.Column("float")
	perihelion: Number;

	// Inclination (deg)
	@TypeORM.Column("float")
	inclination: Number;

	// Ascending Node Longitude
	@TypeORM.Column("float")
	asc_node_long: Number;

	// Arg of Periapsis (deg)
	@TypeORM.Column("float")
	arg_periapsis: Number;

	// Mean Anomaly (deg)
	@TypeORM.Column("float")
	mean_anomaly: Number;

	@TypeORM.ManyToOne((type) => Classification, (classification: Classification) => classification, {
		//adding an IPHistory will also add associated User if it is new, somewhat useless in this example
		cascade: true,
		// if we delete a User, also delete their IP History
		onDelete: "CASCADE"
	})
	classification: TypeORM.Relation<Classification>;

	@TypeORM.ManyToOne((type) => User, (user: User) => user, {
		//adding an IPHistory will also add associated User if it is new, somewhat useless in this example
		cascade: true,
		// if we delete a User, also delete their IP History
		onDelete: "CASCADE"
	})
	creator: TypeORM.Relation<User>;

	@TypeORM.CreateDateColumn()
	created_at: string;
}