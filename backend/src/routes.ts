/** @module Routes */
import fastify, {FastifyInstance, FastifyReply, FastifyRequest, RouteShorthandOptions} from "fastify";
import {User} from "./db/models/user";
import {Classification} from "./db/models/classification";
import {Asteroid} from "./db/models/asteroid";
import { GetURLs } from "./lib/minio";
import {compare, hashSync} from "bcrypt";
import axios from "axios";

export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
export const auth0ClientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
export const auth0ClientSecret = import.meta.env.VITE_AUTH0_CLIENT_SECRET;
export const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;
export const auth0manageToken = import.meta.env.VITE_AUTH0_MANAGE_TOKEN;
export const minioIP = import.meta.env.VITE_MINIO_IP;
export const minioPort = import.meta.env.VITE_MINIO_PORT;
export const minioUrl = `http://${import.meta.env.VITE_MINIO_IP}:${import.meta.env.VITE_MINIO_PORT}`;
export const microIP = import.meta.env.VITE_CSMS_IP;
export const microPort = import.meta.env.VITE_CSMS_PORT;
export const microUrl = `http://${microIP}:${microPort}`;

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
			// app.log.info(asteroids)
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
			// app.log.info(asteroids)
		reply.send(asteroids);
	});

	app.get("/asteroid/image/:string", async (req: any, reply: FastifyReply) => {
		const fileName = req.params.string;

		let urls = await GetURLs(fileName)
		// app.log.info(urls)
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
	// a test
	app.post("/verify", {preValidation: app.authenticate}, async (req: any, reply: FastifyReply) => {
		const response = await app.inject({
			url: '/',
			headers: {
			  Authorization: `Bearer test`
			}
		})
		app.log.info(response)
		reply.send(JSON.stringify(response))
	});
	
	// create an asteroid using auth0 creds?
	type AsteroidCreationRequest = {
		// id: number // created automatically
		// spkid: string, //created automatically
		// full_name: string, //calculated automatically 
		fancy_name: string,
		pdes: string
		// neo: boolean, //calculated automatically
		// pha: boolean, //calculated automatically
		absmag: number,
		diameter: number
		albedo: number,
		eccentricity: number,
		semimajor_axis: number,
		perihelion: number,
		inclination: number,
		asc_node_long: number,
		arg_periapsis: number,
		mean_anomaly: number,
		// created_at: number, //created automatically
		// classificationId: number, //calculated automatically
		// creatorId: number //created automatically with auth from req
	};
	app.post("/asteroid/create", {preValidation: app.authenticate}, async (req: any, reply: FastifyReply) => {

		const decoded = req.user;
		app.log.info(req.decoded)
		let response = await axios.get('https://dev-msr1bjuppruzjysb.us.auth0.com/api/v2/users', {
			params: {q: `user_id:"${decoded.sub}"`, search_engine: 'v3'},
			headers: {authorization: `Bearer ${auth0manageToken}`}
		})
		app.log.info(response.data)
		let requesterEmail = response.data.email
		// else
		// {
		// 	reply.status(500).send("User not found in Auth0 database. How did we get here?!");
		// 	return
		// }

		// const authorization: string = req.headers.authorization;
		// let token = authorization.split(" ")[1]
		// app.log.info(token)
		const request: AsteroidCreationRequest = req.body;
		const newAsteroid = new Asteroid()
		newAsteroid.pdes = request.pdes
		newAsteroid.spkid = `x${request.pdes}`
		newAsteroid.diameter = request.diameter
		newAsteroid.fancy_name = newAsteroid.fancy_name,
		newAsteroid.full_name = `${request.pdes} ${request.fancy_name}`
		newAsteroid.neo = false //placeholder because I dont want to do the math right now
		newAsteroid.pha = false //placeholder because I dont want to do the math right now
		newAsteroid.absmag = request.absmag
		newAsteroid.albedo = request.albedo
		newAsteroid.diameter = request.diameter
		newAsteroid.eccentricity = request.eccentricity
		newAsteroid.semimajor_axis = request.semimajor_axis
		newAsteroid.perihelion = request.perihelion
		newAsteroid.inclination = request.inclination
		newAsteroid.asc_node_long = request.asc_node_long
		newAsteroid.arg_periapsis = request.arg_periapsis
		newAsteroid.mean_anomaly = request.mean_anomaly
		newAsteroid.classification = await Classification.findOneOrFail({
			where: {
				id: 1
			}
		});
		newAsteroid.creator = await User.findOneOrFail({
			where: {
				email: requesterEmail
			}
		});

		reply.send(newAsteroid);
	});
}