/** @module Routes */
import cors from "cors";
import {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {User} from "./db/models/user";
import {Classification} from "./db/models/classification";
import {Asteroid} from "./db/models/asteroid";
import {ILike, LessThan, Like, Not} from "typeorm";

/**
 * App plugin where we construct our routes
 * @param {FastifyInstance} app our main Fastify app instance
 */
export async function asterviz_routes(app: FastifyInstance): Promise<void> {

	/**
	 * Route listing asteroids given a name
	 * @name get/asteroids
	 * @function
	 */
	app.get("/asteroid/name/:string", async (req: any, reply) => {
		const namePart = req.params.string;

		let asteroids = await app.db.asteroid.createQueryBuilder("asteroids")
			.select(["spkid",
				"full_name",
				"neo",
				"pha",
				"absmag",
				"diameter",
				"albedo",
				"eccentricity",
				"semimajor_axis",
				"perihelion",
				"inclination",
				"asc_node_long",
				"arg_periapsis",
				"mean_anomaly",
				"users.name",
				"classifications.abbreviation"
			])
			.innerJoin("asteroids.creator", "users")
			.innerJoin("asteroids.classification", "classifications")
			.where(`LOWER(asteroids.full_name) LIKE LOWER('%${namePart}%')`)
			.limit(20)
			.execute()
			app.log.info(asteroids)
		reply.send(asteroids);
	});

	type FrontEndBodyRequest = {
		"query": string,
		"order": string,
		"limit": number,
		"offset": number
	};
	app.post("/asteroid/search", async (req: any, reply: FastifyReply) => {

		const request: FrontEndBodyRequest = req.body;
		// I <3 SQL. Using a query builder seemed to be less finicky than doing .find() 
		let asteroids = await app.db.asteroid.createQueryBuilder("asteroids")
			.select(["spkid",
				"full_name",
				"neo",
				"pha",
				"absmag",
				"diameter",
				"albedo",
				"eccentricity",
				"semimajor_axis",
				"perihelion",
				"inclination",
				"asc_node_long",
				"arg_periapsis",
				"mean_anomaly",
				"users.name",
				"classifications.abbreviation"
			])
			.innerJoin("asteroids.creator", "users")
			.innerJoin("asteroids.classification", "classifications")
			.where(`LOWER(asteroids.full_name) LIKE LOWER('%${request.query}%')`)
			.limit(request.limit)
			.offset(request.offset)
			.orderBy("asteroids.full_name", (request.order === 'ASC') ? 'ASC' : 'DESC')
			.execute()
			app.log.info(asteroids)
		reply.send(asteroids);
	});
}