# Feb 27 (Start)

I cloned the most recent `doggr` master branch on this date. I will be creating the relevant DB models and seeding/migrating the asteroids.

# March 3 (React + Three.js dialogue)

I added my static-page project to this project and added converted the basic HTML stuff to JSX. Still need to convert the THREE.js canvas stuff into React.

There is a React-Three-Fiber library that basically makes Three.js usable with JSX. As someone who is not that comfortable with React, this will take a lot of effort to learn and implement before the end of the term.

I will first give it a shot to do Three.js in React and see if I can get it working quickly. If I hit a lot of walls, I will try to have everything that is not Three.js be React, and have Three.js be its own JS/TS part.

My initial static page had a Canvas with 3D in it and standard web page HTML on top of it as a pseudo-GUI. I realized that doing this with React makes it quite a pain, so I am going to use Three.js 2D GUI, and have the main web page be 100% Three.js canvas (plus the root div HTML) 

# March 4 (Three.js into React-Three-Fiber. Difficultly figuring out React-Three-Fiber)

Today, I will convert the HTML to Three.js GUI as planned, but in addition, I will instead just implement Three.js in its regular form and not the React Three Fiber form, as that would require learning Three, React, and React Three fiber all at the same time. Learning React is already tough enough. If I have time at the end, I will do the React Three Fiber implementation.

By the end of today, I want to have my Three.js Typescript-only form be active on a canvas component on the home page, and that Canvas component be the only thing on the home page.

Middle of the Day:

I wanted to share some pain: I spent about 2 hours trying to figure out why my mouse controls were not working (left click does nothing and right click opens context menu), then I realized that I had a leftover CSS `z-index: -1;` for the canvas, and I guess the behavior of this on a canvas is different on React than it is for regular HTML

End of the day:

I have hit a wall attempting the pure Three.js within a React canvas. As it turns out, there are no tutorials, libraries or any other material on GUIs for Three.js. This means I will need to use React alongside Three.js, so I will need to use React Three Fiber.

I also did convert my Three.js javascript into typescript and made the code better overall, so hopefully this will make it easier in the long run.

# March 8 (Figured out React-Three-Fiber)

Thanks to Casey providing an example of editing an R3F scene from parent components, I was finally able to get the basic scene working as intended. The user can now toggle asteroids on and off, and right click them to have statistics about them show up on a window on the left.

Turns out all that was needed was passing the states and setStates for the scene up and down the component hierarchy.

One problem that I have no idea how to solve is that anytime the scene adds an asteroid, or changes an attribute of the asteroid (its visibility), the camera resets to the initial position. I suspect it is because the camera is rerendered alongside everything else, but I have no idea how to fix that. I (attempted) to have the camera component be memoized, used in callbacks, refs and states, but I am not sure if I implemented those correctly, as none of those worked.

Short of the camera-resetting issue, this is about where I was with my vanilla JS implementation of the scene

# March 13 (Searching DB for asteroid by name and external component packages)

I had an idea of how to visually improve the main page layout, so I spent about 30 minutes making three tabs on the right side of the page that the user can press to open the side window panel, go to the database search page, and go to an about page.

I also wanted to add the ability to search for an asteroid from the backend database and add it to the scene. I spent only 5 minutes adding the backend route to the database to GET an asteroid by name; it was pretty easy.

Now that a route was made, I had to come up with a search mechanism.

Initially I thought I could quickly create a search box and dropdown menu for searching for an asteroid. I would send a query to the backend when the text in the searchbox updates. However, I didn't want to spend a lot of time on that.

I knew that there seems to be a package for everything these days, so I searched for a react search bar component, and sure enough there was one, so I added it to my project. It appears to work pretty well. When a user makes a query, a GET request goes to the backend to do a `like` query to the asteroid database in the `full_name` field. I limited the response length to only a few asteroids, because the database could be very, very long, and the responses could be also long. Once the backend sends the array of asteroid objects, the frontend creates an entity object for each returned asteroid that stores its orbital information. When the asteroid is clicked or otherwise selected from the search menu, it is added to the solar system react state, thus updating the scene. Since every other part of that process was implemented last week, this asteroid appending process worked flawlessly.

# March 14 (I realize I do not have a lot of time)
I am attempting to build a table display that will allow for the user to query for different aspects of an asteroid, but I am extremely concerned I will run out of time for this project, so I think I will need to abandon the table search function. I already have the function on the main page to run a GET call to the backend, so I have achieved that communication requirement.

I will need to implement file storage, logging in with auth0, and a microservice.

The file storage will just store some UV image textures for the planets.

Auth0 will allow the user to log in. If I find that I have time, I will allow the user to create asteroids.

I cannot think of a microservice that I can build that will be meaningful and be completable in a short amount of time, so my initial thought is to make a Java microservice that will allow for a single GET route that will get the number of asteroids in the backend. Since I know Java, and this is a simple route, this should not be a problem.

By the time I submit this project, it will visibly be a half-complete project. I wish I had at least two more weeks to work on this.

# March 16 (Sourced planet textures, and quickly built a database search table)
I found some free textures to apply to planets, so I now have content to use for the file storage requirement of this project. I also made a clean (and working) search function and table that displays asteroids from the database. I will keep this as is until I have time to make everything better. I still need to add the other project requirements.

# March 17 (Minio setup and R3F texture loading issue)
I have added Minio functionality; it is pretty different than Doggr. Rather than upload images, the frontend will only read images. Because of this, I had to seed the images. I did this like I did for the asteroids; add a seeder and read some files locally to add to the Minio database. Next, I had to make an interface to get files from Minio. I elected to get the public URL of the the images from the database, and return the URL in a JSON. So, I created a GET route that allows for a `name` parameter, and the route will return to the client a public URL to the image stored in the Minio DB.

I am having an issue where only half the images load. The console is telling me that the routes are being called and responded to correctly. I am pretty sure that this is the fault of React-Three-Fiber, but I am not sure what issue is exactly. I tried to load the textures asynchronously and not, and neither worked. But, I got Minio working, so I will fix this issue later since it is not important to the requirements in the end.

# March 18 (Unsecure, Manual login added, and start of Microservice)
I have added the Login functionality to the front end. This required getting all the configs and routes set up on the backend. On the front end, there is now a log in and log out button that show up at the appropriate times, and I have a component that changes depending on if the client is logged in or not.

I now have file storage and logging in working, so the last requirement to create is the microservice. I am thinking about doing it with C# in .NET.

I got a basic GET route working in C# that is basically a Hello World API response. I now need to modify it to access my database do something remotely useful.

I have encountered an issue where there is some "pre-handshake" failure when trying to get the service to connect to the database. I will continue looking at this tomorrow.

# March 19 (Fixing and finishing the Microservice, and the start of auth0 woes)

I realized I could specify in my Google-searching that I am trying to connect to a PostgreSQL database, since all the results before were for Microsoft's SQL DBMS. I found that I needed a different package to access a PostgreSQL database (`Npgsql`). I plugged that in, and now everything is working great when using Postman.

At first, I tried to have the front-end call that microservice route directly, but encountered CORS issues. I have two options to resolve this; allow CORS to the microservice, or route the call to the backend from the frontend, and have the backend return whatever the microservice says. I will go with the latter so that the frontend can stay consistent in its local API calling to backend tech.

I now have a sentence on my database page component that says how many asteroids are in the database, and it is obtained by calling the backend, which calls the microservice; so I now have the microservice fully implemented as envisioned.

I also realized that I need to auth0 as login authentication for the project requirement, so I will try to swap out the jwt implementation with that. After I do this, I will have completed all of the base requirements.

I have created an auth0 account and added the login module to my frontend, but that is as far as I have gotten, I have been stuck for most of the day with varying issues. After I log in, my front end does not indicate that I am logged in, and the auth0 hooks are not returning information back to me that I am authenticated, and I have no idea how to proceed, as I do not know where the issue is.

I think I have narrowed down that I need an ID token after logging in, but after logging in, nothing specific to the user is sent back to the client as far as I can tell, so I simply have no idea what to do.

# March 20 (Slowly figuring out Auth0, and then Docker)

I am completely lost as to what to do. In fact, I am not sure what am even looking for. On my front end, I am able to get a user's meta data when they are logged in. On the backend, I am not sure what needs to be done. I suppose I need some type of use for users who are logged in. I will create an endpoint that could be used to add an asteroid to the database; that requires a user to be associated with it, so that would require a log in.

I found the function call to get the auth0 id token (of the user I hope) on the front end, and am able to send it to the backend via the Bearer authorization header. Now I need to authenticate the user on the backend to get their info... I think.

I think I have implemented auth0 in the correct way. To quote what I proposed in Discord, this is how auth0 works in the project
* User logs into auth0, so the user has an account in the auth0 DB of our project (but not necessarily in our own backend DB)
* Frontend gets back tokens, including the "ID Token" that has their auth0 profile encoded in it
* For whatever API call that requires a logged in user, the frontend would send a request with an authentication header containing the ID token that we got from auth0, plus a body of whatever
* The backend would verify that the token is good

Then, to get the user information from that sent ID token on the backend:
* The backend will userID from the auth header, then send an API call to auth0 via the management API to get the full user meta data

I did this all within a half-implemented 'create asteroid' function. The user would enter in data and send to it the backend and that would get added to the database.

It all appears to be working because:
* An access token gets sent with the request to create an asteroid
* The backend gets the ID token and gets the auth0 userID
* The backend searches its own user database for the user with that same email
* the backend creates the specified asteroid with the user in its own user database, using the user info from the auth0 user

I will also need to add a part were a user is created in the backend if one exists for auth0, but not the backend.
I will also want to remove the password part of the user database, as that is not needed. That table will now basically be an association table between a Display name and an auth0 account.

I believe I am now done with all of the requirements. I will now try to set up docker composition. 

I have setup a virtual box VM of the most recent Ubuntu LTS and installed docker. After some docs writing, I cloned my repo and use `docker compose up`. It appears to have composes correctly and I can access it (on localhost:5000 rather than on port 80). However, it appears that the backend is throwing errors in regards to TypeORM and the Relation class, and I think that is causing my backend to crash, since I cannot access anything from there; only the frontend.

Another issue I encountered was that Typeorm was throwing errors. Turns out it is a known bug on build, so I had to change all instances of a typeorm object to TypeORM.<object>.

Another issue is that I need to migrate and seed the database on docker compose, but now there is an issue where the migration json is not being found, despite it being right there in the same directory that docker is working in.

Tuesday end-of-day is my cut off for working on this project, as I still have to write a paper in another course.

# March 21 (Docker Woes)

Docker is being a pain to set up correctly. You know the story. One error gets fixed. Another comes up in the next step. Fix that error, that breaks something else. Repeat.

Fixing Docker is taking up a lot of time, so I will not be able to guarantee that the final project submission will be that visually pleasing, as I have not gotten to that part yet. I am also starting to doubt there will be a flawless docker compose up execution.

Later:

I have gone through each container individually and confirmed if they work in their own container. I have determined that minio, postgres, frontend and routeCS all work individually, and together. And when I run the backend via pnpm dev or node build, then everything appears to work. The problems start when the backend is in a container.

However, there is an odd bug where if the frontend is compiled/built, auth0 does not work correctly. It just doesn't track that someone is logged in. After logging in, it says for a split second that they are successfully logged in, but then says they are not. On the bright side, when the frontend is compiled, the camera in the solar system scene does not reset when something is clicked, so that is cool.

Tomorrow I will spend a few hours trying to get the backend container working. As a backup, I have written a step-by-step of getting everything to run in a dev environment (with minio, postgre and routecs running in containers).

I also do want to spend a little bit of time improving the CSS and making the required video.

# March 22 (Making it pretty and trying to fix the backend container)

I spent (probably too much) time making the website look better. I removed the random colors and stuck to a 3-color theme, fixed how text is displayed, added tooltips for the astronomy/math terms, and attempted to fix the position of planets to actually be on the orbital ellipse, but I need more time to figure out the math on that and actually have React do what I want it to do. I would say the website is presentable, but I still need to fix the docker deployment.

It is almost midnight, and I still have no idea what the issue with the backend on docker is. Even when I know 100% that postgres is running, the backend cannot find it, either on `localhost` or `postgres`. I have looked into whether they are on the same internal network, changed names, attempted to assign specific addresses, nothing has worked. All of that trying has made a bit of a mess in the code with strings being in place of env references... I would be astounded if anyone could tell me what the issue with this was. I even installed Linux Mint on a different VM and still faces the same issues; granted, it still is technically Ubuntu.

Even in the final hours of fiddling with the docker builds, deploying it with the instructions I provided didn't always work the first try. Sometimes the postgres server would throw some warns about collation, and not take queries from the backend. I swapped the image to a different version and that seemed to fix it, but I don't even know if that was the issue in the first place.

As of right now on the night of 22, I am able to `docker compose up postgres minio routecs frontend`, then migrate/seed/dev run the backend, and everything works. Unfortunate, I do not know if that will be consistent across time and computers, despite changing nothing.

Update to that Auth0 on frontend production build issue: if I spam click where the button to create an asteroid is, when pressing 'login', the appropriate entry does show up in the console, so that tells me the auth stuff works correctly, it is just failing to properly display that the user is actually logged in.

