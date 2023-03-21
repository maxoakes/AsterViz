/** @module DatabasePlugin */
import "reflect-metadata";
import fp from "fastify-plugin";
import TypeORM from "typeorm";
import {User} from "../db/models/user";
import {FastifyInstance, FastifyPluginOptions} from "fastify";
import { AppDataSource } from "../db/datasources/dev_datasource";
import { Classification } from "../db/models/classification";
import { Asteroid } from "../db/models/asteroid";

/** This is AWESOME - we're telling typescript we're adding our own "thing" to base 'app', so we get FULL IDE/TS support */
declare module 'fastify' {

	interface FastifyInstance {
		db: DBConfigOpts
	}

	// interface FastifyRequest {
	// 	myPluginProp: string
	// }
	// interface FastifyReply {
	// 	myPluginProp: number
	// }
}

interface DBConfigOpts {
	user: TypeORM.Repository<User>,
	classification: TypeORM.Repository<Classification>
	asteroid: TypeORM.Repository<Asteroid>,
	connection: TypeORM.DataSource,
}

/**
 * Connects and decorates fastify with our Database connection
 * @function
 */
const DbPlugin = fp(async (app: FastifyInstance, options: FastifyPluginOptions, done: any) => {

	const dataSourceConnection = AppDataSource;

	await dataSourceConnection.initialize();


	// this object will be accessible from any fastify server instance
	// app.status(200).send()
	// app.db.user
	app.decorate("db", {
		connection: dataSourceConnection,
		user: dataSourceConnection.getRepository(User),
		classification: dataSourceConnection.getRepository(Classification),
		asteroid: dataSourceConnection.getRepository(Asteroid)
	});

	done();
}, {
	name: "database-plugin"
});

export default DbPlugin;
