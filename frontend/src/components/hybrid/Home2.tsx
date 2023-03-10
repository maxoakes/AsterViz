import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import * as THREE from "three";
import { Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Entity from "./Entity";
import { metersToUnits } from "./Math";
import { solarSystemPlanetData } from "./Planets";
import SolarSystem, { CelestialBody } from "./SolarSystem";
import Star from "./Star";

export function Home()
{
  
  const ref = useRef<HTMLCanvasElement>(null);
  const [grid, setGrid] = useState(new THREE.GridHelper( 100, 100 ));
  const [axes, setAxes] = useState(new THREE.AxesHelper( 50 ));
  const [scene, setScene] = useState(new THREE.Scene());
  const [renderer, setRenderer] = useState(new THREE.WebGLRenderer());
  const [camera, setCamera] = useState(new THREE.PerspectiveCamera(40, 16 / 9, 0.1, 10000));
  const [controls, setControls] = useState(new OrbitControls(camera, renderer.domElement));
  const [sun, setSun] = useState(new Star(metersToUnits(695700000), 0xffff00));
  const initialState: Entity[] = [];
  const [allPlanets, setAllPlanets] = useState(initialState);
  const [allAsteroids, setAllAsteroids] = useState(initialState);
  const [selectedEntity, setSelectedEntity] = useState(undefined);

  useEffect(() => {
    console.log(ref.current);
    if (!ref.current) return;
    let frameRequest: number;
    // const renderer = new THREE.WebGLRenderer({canvas: ref.current, antialias: true});
    // where all the good stuff happens
    // solarSystemScene = new SolarSystem(renderer);

    // init the scene
    let rend = new THREE.WebGLRenderer({canvas: ref.current, antialias: true})
    rend.setSize(window.innerWidth, window.innerHeight);
    setRenderer(rend);
    
    camera.position.set(-3,3,3);
    setCamera(camera)

    let oc = new OrbitControls(camera, renderer.domElement);
    oc.enableDamping = false;
    setControls(oc);

    scene.add(grid); // show 1x1 unit grid for 100 units in x and z
    scene.add(axes); // x=red, y=green, z=blue
    setScene(scene);

    // build the scene
    let ss = solarSystemPlanetData;
    for (let [planetName, attributes] of Object.entries(ss)) {
      let thisType = (planetName === 'sample') ? CelestialBody.Asteroid : CelestialBody.Planet; 
      let newPlanetObject = new Entity(
        thisType, 
        attributes.name, 
        attributes.diameter, attributes.albedo, 
        attributes.eccentricity,
        attributes.semimajor_axis,
        attributes.perihelion,
        attributes.inclination,
        attributes.asc_node_long,
        attributes.arg_periapsis,
        attributes.mean_anomaly,
        attributes.true_anomaly,
        attributes.classid);
      if (thisType == CelestialBody.Planet)
      {
        allPlanets.push(newPlanetObject);
        
      }
      else
      {
        allAsteroids.push(newPlanetObject);
        
      }
    }
    let populateScene = () =>
    {
        console.log("Refeshing Scene")
        setSelectedEntity(undefined);
        let newScene = new THREE.Scene();
        setAllPlanets([]);
        setAllAsteroids([]);
        newScene.add(sun.star);
        allAsteroids.forEach(asteroid => {
          newScene.add(asteroid.entityBody);
          newScene.add(asteroid.entityOrbit);
        });
        allPlanets.forEach(planet => {
          newScene.add(planet.entityBody);
          newScene.add(planet.entityOrbit);
        })
        setScene(newScene);
        setAllPlanets(allPlanets);
        setAllAsteroids(allAsteroids)
    }
    populateScene();

    let resize = () =>
    {
        camera.aspect = window.innerWidth / window.innerHeight;
        renderer.setSize( window.innerWidth, window.innerHeight );
        setRenderer(renderer);
        camera.updateProjectionMatrix();
        setCamera(camera);
        console.log(`Window Resized to ${camera.aspect}`)
    }
    window.addEventListener('resize', resize);
    resize();

    let animate = () =>
    {
      frameRequest = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      setRenderer(renderer);
    };
    animate();

    return () => { 
      window.cancelAnimationFrame(frameRequest)
    }
  }, []);

  useEffect(() => {
    console.log(`grid ${grid}`)
    grid.visible = !grid.visible;
    setGrid(grid);
    console.log(`scene grid ${grid.visible}`)
  }, [grid]);

  useEffect(() => {
    console.log(allAsteroids)
  }, [allAsteroids])

  return (
    <>
    <canvas ref={ref}/>
    <SidePanel/>
    <InfoView/>
    <div id="buttons">
      <WidgetButton name="grid-toggle" text="Show Reference Plane Grid" isChecked={grid.visible} onToggleClick={() => {grid.visible = !grid.visible; setGrid(grid)}}/>
      <WidgetButton name="axes-toggle" text="Show Center 3D Axes" isChecked={axes.visible} onToggleClick={() => {axes.visible = !axes.visible; setAxes(axes)}}/>
    </div>
    </>
  );
}


export type WidgetButtonProp = {
	name: string,
	text: string,
	isChecked: boolean,
  onToggleClick: () => void,
}
export function WidgetButton({name, text, isChecked, onToggleClick}: WidgetButtonProp)
{
  return (
    <div className="widget-item">
      <input type="checkbox" id={name} name={name} onClick={onToggleClick} checked={isChecked}/>
      <label htmlFor={name}>{text}</label>
    </div>
  )
}

export function SidePanel()
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="side-window" style={{display: isOpen ? "block" : "none", right: 0}} id="rightMenu">
        <button onClick={() => setIsOpen(current => !current)} className="transition-button full-width">Close &times;</button>
          <div id="entity-list">
            <div className="entity-list-item">
              <input type="checkbox" id="sun-toggle" name="sun-toggle" checked/>
              <label htmlFor="sun-toggle">Sun</label>
            </div>
            <p>List of all planets and asteroids in window</p>
            <p>'Add' button to add asteroid from the database</p>
            <p>Link to go to different page to search for asteroids in DB</p>
          </div>
        <button onClick={() => console.log("DB")} className="transition-button full-width">Go to Database Search</button>
      </div>
      <button className="side-window-button transition-button" onClick={() => setIsOpen(current => !current)}>icon</button>
    </>
    )
}

export function InfoView()
{
  return (
    <div id="info-viewer">
      <div>
        <p className="entity-title">Title</p>
      </div>
      <div className="info-container">
        <p className="info-title">Title</p>
        <p className="info-string">String</p>
      </div>
      <div className="info-container">
        <p className="info-title">Title</p>
        <p className="info-string">String</p>
      </div>
      <div className="info-container">
        <p className="info-title">Title</p>
        <p className="info-string">String</p>
      </div>
    </div>
  )
}