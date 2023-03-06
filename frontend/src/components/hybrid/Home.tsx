import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Scene } from "three";
import Entity from "./Entity";
import SolarSystem from "./SolarSystem";

export function Home()
{
  const initialState: Entity[] = [];
  const ref = useRef<HTMLCanvasElement>(null);
  const [gridActive, setGridActive] = useState(true);
  const [axesActive, setAxesActive] = useState(true);
  const [allPlanets, setAllPlanets] = useState(initialState);
  const [allAsteroids, setAllAsteroids] = useState(initialState);
  const [selectedEntity, setSelectedEntity] = useState(undefined);
  let solarSystemScene: SolarSystem;

  useEffect(() => {
    console.log(ref.current);
    if (!ref.current) return;
    let frameRequest: number;
    const renderer = new THREE.WebGLRenderer({canvas: ref.current, antialias: true});
    
    // where all the good stuff happens
    solarSystemScene = new SolarSystem(renderer);
    setAllAsteroids(solarSystemScene.asteroids);

    let animate = () =>
    {
      frameRequest = requestAnimationFrame(animate);
      solarSystemScene.renderer.render(solarSystemScene.scene, solarSystemScene.camera);
    };
    animate();

    return () => { 
        window.cancelAnimationFrame(frameRequest)
      }
  }, []);

  useEffect(() => {
    if (!solarSystemScene) return;
    console.log(`grid ${gridActive}`)
    solarSystemScene.grid.visible = gridActive;
    console.log(`scene grid ${solarSystemScene.grid.visible}`)
  }, [gridActive]);

  useEffect(() => {
    console.log(allAsteroids)
  }, [allAsteroids])

  return (
    <>
    <canvas ref={ref}/>
    <SidePanel/>
    <InfoView/>
    <div id="buttons">
      <WidgetButton name="grid-toggle" text="Show Reference Plane Grid" isChecked={gridActive} onToggleClick={() => setGridActive(!gridActive)}/>
      <WidgetButton name="axes-toggle" text="Show Center 3D Axes" isChecked={axesActive} onToggleClick={() => setAxesActive(!axesActive)}/>
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