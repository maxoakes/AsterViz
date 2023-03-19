/** @module Routes */
import {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {User} from "./db/models/user";
import {Classification} from "./db/models/classification";
import {Asteroid} from "./db/models/asteroid";
import { GetURLs } from "./lib/minio";
import {compare, hashSync} from "bcrypt";
import axios from "axios";

// @ts-ignore
const microIP = import.meta.env.VITE_CSMS_IP;
// @ts-ignore
const microPort = import.meta.env.VITE_CSMS_PORT;

const microUrl = `http://${microIP}:${microPort}`;

/**
 * App plugin where we construct our routes
 * @param {FastifyInstance} app our main Fastify app instance
 */
export async function asterviz_routes(app: FastifyInstance): Promise<void> {

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

	app.get("/asteroid/image/:string", async (req: any, reply: FastifyReply) => {
		const fileName = req.params.string;

		let urls = await GetURLs(fileName)
		app.log.info(urls)
		reply.send({urls});
	});

	app.get("/stats/asteroids", async (req: any, reply: FastifyReply) => {

		// a call from the backend to call a microservice. brilliant
		let stats = await axios.get(`${microUrl}/AsteroidStats`)
		reply.send(stats.data.asteroidCount);
	});

	type CreateUserRequest = {
		name: string,
		email: string,
		password: string
	};
	app.post("/users", async (req: any, reply: FastifyReply) => {

		const request: CreateUserRequest = req.body;
		let password: string = request.password;

		// if we're in dev mode and pw isn't already bcrypt encrypted, do so now for convenience
		if (import.meta.env.DEV) {
			if (!request.password.startsWith("$2a$")) {
				password = hashSync(password, 2);
			}
		}

		const user = new User();
		user.name = request.name;
		user.email = request.email;
		user.password = password;
		user.save();

		await reply.send(JSON.stringify({user}));
	});
	
	type LoginRequest = {
		email: string,
		password: string
	};
	app.post("/login", async (req: any, reply: FastifyReply) => {

		try {
			const request: LoginRequest = req.body;

			let theUser = await app.db.user.findOneOrFail({
				where: {
					email: request.email
				}
			});

			const hashCompare = await compare(request.password, theUser.password);

			if (hashCompare) {
				// User has authenticated successfully!
				const token = app.jwt.sign({id: theUser.id});
				// const token = app.jwt.sign({email, id: theUser.id});
				await reply.send({token});
			} else {
				app.log.info("Password validation failed");
				await reply.status(401)
					.send("Incorrect Password");
			}
		} catch (err) {
			app.log.error(err);
			await reply.status(500)
				.send("Error: " + err);
		}
	});
}