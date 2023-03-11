import {OrbitControls, PerspectiveCamera, Line} from "@react-three/drei";
import {Canvas, ThreeElements, useFrame} from "@react-three/fiber";
import {SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {solarSystemPlanetData} from "./Planets";
import Entity from "./Entity";
import {au, CelestialBody, degToRad, metersToUnits, minEntityRadius, sunRadius} from "./helper";
import { Vector3 } from "three";

// https://codesandbox.io/s/qxjoj?file=/src/App.js
export function Home()
{
  const [asteroids, setAsteroids] = useState<Entity[]>([]);
	const [planets, setPlanets] = useState<Entity[]>([]);
  const [selectedEntity, setSelectedEntity] = useState<Entity>(null!);

  function assignSelected(entity: Entity)
  {
    setSelectedEntity(entity);
  }

  function appendAsteroid(entity: Entity)
  {
    setAsteroids(asteroids => [...asteroids, entity])
  }

  function appendPlanet(entity: Entity)
  {
    setPlanets(planets => [...planets, entity])
  }

  function toggleVisibility(entity: Entity)
  {
    let updatedEntity = entity;
    
    let planetIndex = planets.indexOf(entity);
    let asteroidIndex = asteroids.indexOf(entity);
    if (planetIndex > -1)
    {
      let arrayCopy = [...planets];
      let itemCopy = planets[planetIndex];
      planets[planetIndex] = updatedEntity;
      if (itemCopy)
      {
        itemCopy.isVisible = !itemCopy.isVisible;
        arrayCopy[planetIndex] = itemCopy;
        setPlanets(arrayCopy)
      }
    }
    else if (asteroidIndex > -1)
    {
      let arrayCopy = [...asteroids];
      let itemCopy = asteroids[asteroidIndex];
      asteroids[planetIndex] = updatedEntity;
      if (itemCopy)
      {
        itemCopy.isVisible = !itemCopy.isVisible;
        arrayCopy[asteroidIndex] = itemCopy;
        setAsteroids(arrayCopy)
      }
    }
    else
    {
      console.warn("Entity not found anywhere?!")
    }
    console.log(`Changing visibility of ${entity.name} to ${entity.isVisible}`)
  }

  function removeEntity(entity: Entity)
  {
    let copy = [...asteroids];
    let index = copy.indexOf(entity);
    if (index > -1)
    {
      copy.splice(index, 1);
      setAsteroids(copy);
    }
    
  }

	return (
		<>
			<Canvas shadows={false}>
				<SolarSystem assignSelected={assignSelected} appendAsteroid={appendAsteroid} appendPlanet={appendPlanet} planets={planets} asteroids={asteroids}/>
        <PerspectiveCamera fov={40} aspect={16 / 9} near={0.1} far={10000}/>
			  <OrbitControls makeDefault enableDamping={false} position={new THREE.Vector3(-3,3,3)}/>
        <ambientLight intensity={1}/>
			</Canvas>
			<InfoView selectedEntity={selectedEntity}/>
      <SidePanel planets={planets} asteroids={asteroids} toggle={toggleVisibility} trash={removeEntity}/>
		</>
	);
}

export type SolarSystemProp = {
  appendAsteroid: (entity: Entity) => void,
  appendPlanet: (entity: Entity) => void,
  assignSelected: (entity: Entity) => void,
  planets: Entity[],
  asteroids: Entity[]
}

export function SolarSystem({appendAsteroid, appendPlanet, assignSelected, planets, asteroids}: SolarSystemProp) {

	useEffect(() => {
		console.log("Creating solar system in useEffect");
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
				appendPlanet(newPlanetObject);
			}
      else
      {
				appendAsteroid(newPlanetObject);
			}
		}
	}, []);

	// EntityComponent's `position` property is provided by react-three-fiber and newScale is ours
	return (
		<>
			<mesh name="Sun">
        <sphereGeometry args={[Math.max(metersToUnits(695700000), minEntityRadius*8), 64, 32]}/>
        <meshStandardMaterial color={0xff8800}/>
      </mesh>
			{planets == null ? null :
				planets.map((entity) => {
					return <EntityComponent key={entity.name} entity={entity} assignSelected={assignSelected}/>
				})
			}
      {asteroids == null ? null :
				asteroids.map((entity) => {
					return <EntityComponent key={entity.name} entity={entity} assignSelected={assignSelected}/>
				})
			}
			<Axes isVisible={true}/>
			<Grid isVisible={true}/>
		</>
	)
}

type EntityProps = ThreeElements['mesh'] & {
  entity: Entity,
  assignSelected: (entity: Entity) => void
}

function EntityComponent(props: EntityProps) {
	// This reference will give us direct access to the mesh
	const planetMesh = useRef<THREE.Mesh>(null!);
  const orbitLine = useRef<THREE.Line>(null!);

	let {entity, assignSelected} = props;
  let visualRadius = Math.max(metersToUnits(entity.diameter/2), minEntityRadius*4)
  let orbitPoints = useMemo(() => new THREE.EllipseCurve(
    entity.focusDistance, 0, // ax, aY
    entity.semimajor_axis, entity.semiMinorAxis, // semiminor axis, semimajor axis
    0.1, 2 * Math.PI - 0.1, // aStartAngle, aEndAngle
    false, // aClockwise
    degToRad(0) // aRotation
  ).getPoints(Math.max(64, Math.round(2000*entity.eccentricity))), []);
	return (<>
		<mesh 
      {...props} 
      ref={planetMesh} 
      name={entity.name} 
      position={[metersToUnits((entity.perihelion)*au), 0, 0]} 
      onClick={(event) => {assignSelected(entity)}} 
      visible={entity.isVisible}
    >
      {entity.type === CelestialBody.Planet ? <sphereGeometry args={[visualRadius, 64, 32]}/> : <icosahedronGeometry args={[visualRadius, 1]}/>}
			<meshStandardMaterial color={(entity.type == CelestialBody.Planet) ? 0x00ff00 : 0x0000ff}/>
		</mesh>
    <Line 
      // ref={orbitLine}
      worldUnits
      name={`${entity.name}'s Orbit`} 
      rotation={[degToRad(entity.inclination+90), 0, degToRad(entity.asc_node_long)]} 
      points={orbitPoints} 
      color={(entity.type == CelestialBody.Planet) ? 0x00ff00 : 0xff00ff}
      wireframe lineWidth={0.001}/>
    </>
	)
}

function Box(props: ThreeElements['mesh']) {
	// This reference will give us direct access to the mesh
	const mesh = useRef<THREE.Mesh>(null!)

	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (mesh.current.rotation.x += delta))
	// Return view, these are regular three.js elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={mesh}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]}/>
			<meshStandardMaterial color={hovered ? 0xffffff : 0xffff00}/>
		</mesh>
	)
}

type InfoViewProp = {
  selectedEntity: Entity
}

export function InfoView(props: InfoViewProp) {
	const {selectedEntity} = props;

  let infoItems = createInfoDictionary(selectedEntity);
  const infoList = Object.keys(infoItems).map(item => 
    <div className="info-container" key={item}>
      <p className="info-title">{item}</p>
      <p className="info-string">{infoItems[item]}</p>
    </div>);
	return (
    <>
      {(selectedEntity) ? 
        <div id="info-viewer">
          {infoList}
        </div> : <></>
      }
    </>)
}

function createInfoDictionary(entity: Entity | undefined): Record <string, any>
{
  if (!entity)
  {
    return {}
  }
    return {"Name": entity.name,
    "Type": entity.type, 
    "Average Diameter": `${entity.diameter}km`,
    "Albedo": entity.albedo,
    "Eccentricity": entity.eccentricity,
    "Semi-major Axis": `${entity.semimajor_axis} AU`,
    "Perihelion": `${entity.perihelion} AU`,
    "Inclination": `${entity.inclination} deg`,
    "Longitude of Ascending Node": `${entity.asc_node_long} deg`, 
    "Argument of Periapsis": `${entity.arg_periapsis} deg`,
    "Mean Anomaly": `${entity.mean_anomaly} deg`, 
    "True Anomaly": `${entity.true_anomaly} deg`,
    "Class": entity.classid
  };
}

type SidePanelProp = {
  planets: Entity[],
  asteroids: Entity[]
  toggle: (entity: Entity) => void
  trash: (entity: Entity) => void
}
export function SidePanel(props: SidePanelProp)
{
  let {planets, asteroids, toggle, trash} = props;
	const [isOpen, setIsOpen] = useState(false);
  const allEntities = [...planets, ...asteroids];

  const entityChecklist = allEntities.map(item => 
    <div className="entity-list-item" key={item.name}>
      <input type={"checkbox"} name={`${item.name}-toggle`} onClick={() => toggle(item)} checked={item.isVisible} />
      <label htmlFor={`${item.name}-toggle`}>{item.name}</label>
      {(item.type == CelestialBody.Asteroid) ? <button type="button" onClick={() => trash(item)}>Remove from Scene</button> : <></>}
    </div>
  )

	return (
		<>
			<div className="side-window" style={{display: isOpen ? "block" : "none", right: 0}} id="rightMenu">
				<button onClick={() => setIsOpen(current => !current)}
								className="transition-button full-width">Close &times;</button>
				<div id="entity-list">
          {entityChecklist}
				</div>
        <input type="text" name="find" onChange={e => {}}/>
				<button onClick={() => console.log("DB")} className="transition-button full-width">Go to Database Search
				</button>
			</div>
			<button className="side-window-button transition-button" onClick={() => setIsOpen(current => !current)}>icon
			</button>
		</>
	)
}

type AxesProp = { isVisible: boolean }

function Axes({isVisible}: AxesProp) {
	// args = [scale]
	return (
		<axesHelper args={[50]} visible={isVisible}/>
	)
}

type GridProp = { isVisible: boolean }

function Grid({isVisible}: GridProp) {
	// args = [x-y length, num divisions]
	return (
		<gridHelper args={[100, 100]} visible={isVisible}/>
	)
}