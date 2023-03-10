import {OrbitControls, PerspectiveCamera, Line} from "@react-three/drei";
import {Canvas, ThreeElements, useFrame} from "@react-three/fiber";
import {SetStateAction, useEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {solarSystemPlanetData} from "./Planets";
import Entity from "./Entity";
import {au, CelestialBody, degToRad, metersToUnits, minEntityRadius} from "./helper";
import { Vector3 } from "three";

// https://codesandbox.io/s/qxjoj?file=/src/App.js
export function Home()
{

  const [selectedEntity, setSelectedEntity] = useState<Entity>(null!);

  function assignSelected(entity: Entity)
  {
    setSelectedEntity(entity);
    console.log(selectedEntity)
  }

	return (
		<>
			<Canvas shadows={false}>
				<SolarSystem assignSelected={assignSelected}/>
        <PerspectiveCamera fov={40} aspect={16 / 9} near={0.1} far={10000}/>
			  <OrbitControls makeDefault enableDamping={false} position={new THREE.Vector3(-3,3,3)}/>
        <ambientLight intensity={1}/>
			</Canvas>
			<InfoView selectedEntity={selectedEntity}/>
		</>
	);
}

export type SolarSystemProp = {
  assignSelected: (entity: Entity) => void
}

export function SolarSystem({assignSelected}: SolarSystemProp) {

	const [asteroids, setAsteroids] = useState<Entity[]>([]);
	const [planets, setPlanets] = useState<Entity[]>([]);

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
				// console.log("Adding planet");
				setPlanets(planets => [...planets, newPlanetObject]);
			}
      else
      { // @ts-ignore
				setAsteroids(asteroids => [...asteroids, newPlanetObject]);
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
					return <EntityComponent entity={entity} assignSelected={assignSelected}/>
				})
			}
      {asteroids == null ? null :
				asteroids.map((entity) => {
					return <EntityComponent  entity={entity} assignSelected={assignSelected}/>
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
		<mesh {...props} ref={planetMesh} name={entity.name} position={[metersToUnits((entity.perihelion)*au), 0, 0]} onClick={(event) => {assignSelected(entity)}}>
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
    <>
      <p className="info-title">{item}</p>
      <p className="info-string">{infoItems[item]}</p>
    </>);
	return (
		<div id="info-viewer">
      {(infoItems) ? <div className="info-container">{infoList}</div> : <></>}
		</div>
	)
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

export function SidePanel() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="side-window" style={{display: isOpen ? "block" : "none", right: 0}} id="rightMenu">
				<button onClick={() => setIsOpen(current => !current)}
								className="transition-button full-width">Close &times;</button>
				<div id="entity-list">
					<div className="entity-list-item">
						<input type="checkbox" id="sun-toggle" name="sun-toggle" checked/>
						<label htmlFor="sun-toggle">Sun</label>
					</div>
					<p>List of all planets and asteroids in window</p>
					<p>'Add' button to add asteroid from the database</p>
					<p>Link to go to different page to search for asteroids in DB</p>
				</div>
				<button onClick={() => console.log("DB")} className="transition-button full-width">Go to Database Search
				</button>
			</div>
			<button className="side-window-button transition-button" onClick={() => setIsOpen(current => !current)}>icon
			</button>
		</>
	)
}

export type WidgetButtonProp = {
	name: string,
	text: string,
	isChecked: boolean,
	onToggleClick: () => void,
}

export function WidgetButton({name, text, isChecked, onToggleClick}: WidgetButtonProp) {
	return (
		<div className="widget-item">
			<input type="checkbox" id={name} name={name} onClick={onToggleClick} checked={isChecked}/>
			<label htmlFor={name}>{text}</label>
		</div>
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