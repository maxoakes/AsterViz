# Feb 27.

I cloned the most recent `doggr` master branch on this date. I will be creating the relevant DB models and seeding/migrating the asteroids

# March 3

I added my static-page project to this project and added converted the basic HTML stuff to JSX. Still need to convert the THREE.js canvas stuff into React.

There is a React-Three-Fiber library that basically makes Three.js usable with JSX. As someone who is not that comfortable with React, this will take a lot of effort to learn and implement before the end of the term.

I will first give it a shot to do Three.js in React and see if I can get it working quickly. If I hit a lot of walls, I will try to have everything that is not Three.js be React, and have Three.js be its own JS/TS part.

My initial static page had a Canvas with 3D in it and standard web page HTML on top of it as a pseudo-GUI. I realized that doing this with React makes it quite a pain, so I am going to use Three.js 2D GUI, and have the main web page be 100% Three.js canvas (plus the root div HTML) 

# March 4

Today, I will convert the HTML to Three.js GUI as planned, but in addition, I will instead just implement Three.js in its regular form and not the React Three Fiber form, as that would require learning Three, React, and React Three fiber all at the same time. Learning React is already tough enough. If I have time at the end, I will do the React Three Fiber implementation.

By the end of today, I want to have my Three.js Typescript-only form be active on a canvas component on the home page, and that Canvas component be the only thing on the home page.

Middle of the Day:

I wanted to share some pain: I spent about 2 hours trying to figure out why my mouse controls were not working (left click does nothing and right click opens context menu), then I realized that I had a leftover CSS `z-index: -1;` for the canvas, and I guess the behavior of this on a canvas is different on React than it is for regular HTML

End of the day:

I have hit a wall attempting the pure Three.js within a React canvas. As it turns out, there are no tutorials, libraries or any other material on GUIs for Three.js. This means I will need to use React alongside Three.js, so I will need to use React Three Fiber.

I also did convert my Three.js javascript into typescript and made the code better overall, so hopefully this will make it easier in the long run.

# March 8

Thanks to Casey providing an example of editing an R3F scene from parent components, I was finally able to get the basic scene working as intended. The user can now toggle asteroids on and off, and right click them to have statistics about them show up on a window on the left.

Turns out all that was needed was passing the states and setStates for the scene up and down the component hierarchy.

One problem that I have no idea how to solve is that anytime the scene adds an asteroid, or changes an attribute of the asteroid (its visibility), the camera resets to the initial position. I suspect it is because the camera is rerendered alongside everything else, but I have no idea how to fix that. I (attempted) to have the camera component be memoized, used in callbacks, refs and states, but I am not sure if I implemented those correctly, as none of those worked.

Short of the camera-resetting issue, this is about where I was with my vanilla JS implementation of the scene

# March 13

I had an idea of how to visually improve the main page layout, so I spent about 30 minutes making three tabs on the right side of the page that the user can press to open the side window panel, go to the database search page, and go to an about page.

I also wanted to add the ability to search for an asteroid from the backend database and add it to the scene. I spent only 5 minutes adding the backend route to the database to GET an asteroid by name; it was pretty easy.

Now that a route was made, I had to come up with a search mechanism. I knew that there seems to be a package for everything these days, so I searched for a react search bar component, and sure enough there was one, so I added it to my project. It appears to work pretty well. When a user makes a query, a GET request goes to the backend to do a `like` query to the asteroid database in the `full_name` field. I limited the response length to only a few asteroids, because the database could be very, very long, and the responses could be also long. Once the backend sends the array of asteroid objects, the frontend creates an entity object to store the asteroid's orbital information, and that asteroid is added to the Solar System's asteroid state, thus updating the scene. Since every other part of that process was implemented last week, this asteroid appending process worked flawlessly.