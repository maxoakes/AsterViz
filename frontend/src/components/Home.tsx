import {OrbitControls, PerspectiveCamera, Line, useTexture} from "@react-three/drei";
import {Canvas, ThreeElements, useFrame, useLoader} from "@react-three/fiber";
import {Fragment, useCallback, useEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {solarSystemPlanetData} from "./Planets";
import Entity from "./Entity";
import {AsteroidResponse, au, CelestialBody, degToRad, metersToUnits, minEntityRadius, sunRadius} from "./helper";
import { httpClient } from "../services/HttpService";
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Link, useNavigate } from "react-router-dom";
import { Texture } from "three";
import { minioUrl } from "../App";

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

  useEffect(() => {
		console.log("Canvas Main Page Rendered");
	});

	return (
		<>
			<Canvas shadows={false}>
				<SolarSystem assignSelected={assignSelected} appendAsteroid={appendAsteroid} appendPlanet={appendPlanet} planets={planets} asteroids={asteroids}/>
        <ForeverCamera asteroids={asteroids} planets={planets} selectedEntity={selectedEntity}/>
        <ambientLight intensity={1}/>
			</Canvas>
			<InfoView selectedEntity={selectedEntity}/>
      <SidePanel planets={planets} asteroids={asteroids} appendAsteroid={appendAsteroid} toggle={toggleVisibility} trash={removeEntity}/>
		</>
	);
}

export type ForeverCameraProps = {
  planets: Entity[],
  asteroids: Entity[],
  selectedEntity: Entity
}
export function ForeverCamera({planets, asteroids, selectedEntity}: ForeverCameraProps)
{  
  return (<>
    <PerspectiveCamera fov={40} aspect={16 / 9}/>
    <OrbitControls makeDefault position={new THREE.Vector3(-3,3,3)}/>
  </>)
}

export type SolarSystemProp = {
  appendAsteroid: (entity: Entity) => void,
  appendPlanet: (entity: Entity) => void,
  assignSelected: (entity: Entity) => void,
  planets: Entity[],
  asteroids: Entity[]
}

export function SolarSystem({appendAsteroid, appendPlanet, assignSelected, planets, asteroids}: SolarSystemProp) {
  const [sunTexture, setSunTexture] = useState<Texture>();

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
    const fetchTexturePath = async() => {
      let sunTexturePathResponse = await httpClient.get(`/asteroid/image/sun`);
      const textureManager = new THREE.TextureLoader();
      textureManager.setPath(minioUrl)
      console.log(minioUrl + sunTexturePathResponse.data.urls[0])
      setSunTexture(textureManager.load(sunTexturePathResponse.data.urls[0]));
		};
    fetchTexturePath().catch(console.error);
	}, []);

	// EntityComponent's `position` property is provided by react-three-fiber and newScale is ours
	return (
		<>
			<mesh name="Sun">
        <sphereGeometry args={[Math.max(metersToUnits(695700000), minEntityRadius*10), 64, 32]}/>
        <meshStandardMaterial  map={sunTexture}/>
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
  const [texture, setTexture] = useState<Texture>();

  useEffect(() => {
    const fetchTexturePath = async() => {
      let dest = `/asteroid/image/${props.entity.name.toLowerCase()}`
      let texturePath = await httpClient.get(dest);
      const textureManager = new THREE.TextureLoader();
      textureManager.setPath(minioUrl)
      console.log(minioUrl + texturePath.data.urls[0])
      setTexture(textureManager.load(texturePath.data.urls[0]));
		};
    fetchTexturePath().catch(console.error);
  }, [])

	let {entity, assignSelected} = props;
  let visualRadius = Math.max(metersToUnits(entity.diameter/2)*400000, minEntityRadius*2)
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
      {entity.type === CelestialBody.Planet ? <sphereGeometry args={[visualRadius, 64, 32]}/> : <icosahedronGeometry args={[visualRadius, 2]}/>}
			<meshStandardMaterial map={texture} color={entity.type === CelestialBody.Planet ? 0xffffff : 0xff00ff}/>
		</mesh>
    <Line 
      // ref={orbitLine}
      worldUnits
      name={`${entity.name}'s Orbit`} 
      rotation={[degToRad(entity.inclination+90), 0, degToRad(entity.asc_node_long)]} 
      points={orbitPoints} 
      color={(entity.type == CelestialBody.Planet) ? 0x00ff00 : 0xff00ff}
      wireframe lineWidth={0.001}
      visible={entity.isVisible}/>
    </>
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
  asteroids: Entity[],
  appendAsteroid: (entity: Entity) => void,
  toggle: (entity: Entity) => void
  trash: (entity: Entity) => void
}
export function SidePanel(props: SidePanelProp)
{
  const {planets, asteroids, appendAsteroid, toggle, trash} = props;
	const [isOpen, setIsOpen] = useState(false);
  const allEntities = [...planets, ...asteroids];
  const navigate = useNavigate();

  const entityChecklist = allEntities.map(item => 
    <div className="entity-list-item" key={item.name}>
      <input type={"checkbox"} name={`${item.name}-toggle`} onClick={() => toggle(item)} checked={item.isVisible} onChange={(e => {})}/>
      {(item.type == CelestialBody.Asteroid) ? <button type="button" onClick={() => trash(item)} className="inline-entity-button"><img src="https://i.imgur.com/MzzuH05.png"/></button> : <></>}
      <label htmlFor={`${item.name}-toggle`}>{item.name}</label>
      
    </div>
  )

	return (
		<>
			<div className="side-window" style={{display: isOpen ? "block" : "none", right: 0}} id="rightMenu">
				<button onClick={() => setIsOpen(current => !current)} className="transition-button full-width close-button">
          Close &times;
        </button>
        <SearchBar appendAsteroid={appendAsteroid}/>
				<div id="entity-list">
          {entityChecklist}
				</div>
			</div>
			<button className="side-window-button first-button" onClick={() => setIsOpen(current => !current)}>
        <img src="https://i.imgur.com/2xlZt2X.png" className="button-icon"/>
      </button>
      <button className="side-window-button second-button" onClick={() => navigate('/database')}>
        <img src="https://i.imgur.com/IZV8EQo.png" className="button-icon"/>
      </button>
		</>
	)
}

type SearchBarProps = {
  appendAsteroid: (entity: Entity) => void,
}
export function SearchBar(props: SearchBarProps)
{
  const {appendAsteroid} = props;
  const [query, setQuery] = useState('');
  const [data, setData] = useState<AsteroidResponse[]>([]);

  useEffect(() => {
    const fetchAsteroids = async() => {
      const response = await httpClient.get(`/asteroid/name/${query}`);
      setData(response.data);
		};
    fetchAsteroids().catch(console.error);
  }, [query])
  
  const handleOnSearch = (string: string, results: any) => {
    setQuery(string)
  };

  const handleOnHover = (result: any) => {
    console.log(result);
  };

  const handleOnSelect = (item: AsteroidResponse) => {
    console.log("Chose", item);
    const newAsteroid = new Entity(
      CelestialBody.Asteroid, item.full_name, item.diameter, item.albedo, 
      item.eccentricity, item.semimajor_axis, item.perihelion, item.inclination,
      item.asc_node_long, item.arg_periapsis, item.mean_anomaly, item.mean_anomaly, 0);
    appendAsteroid(newAsteroid)
  };

  const handleOnFocus = () => {
    console.log("Focused");
  };

  const handleOnClear = () => {
    console.log("Cleared");
  };

  return (
    <div className="main-search-bar-container">
      <ReactSearchAutocomplete
        items={data}
        fuseOptions={{ keys: ["full_name"] }} // Search on both fields
        resultStringKeyName="full_name" // String to display in the results
        onSearch={handleOnSearch}
        onHover={handleOnHover}
        onSelect={handleOnSelect}
        onFocus={handleOnFocus}
        onClear={handleOnClear}
        showIcon={true}
        styling={{
          height: "34px",
          border: "1px solid darkgreen",
          borderRadius: "4px",
          backgroundColor: "white",
          boxShadow: "none",
          hoverBackgroundColor: "lightgreen",
          color: "darkgreen",
          fontSize: "12px",
          fontFamily: "Courier",
          iconColor: "green",
          lineColor: "lightgreen",
          placeholderColor: "darkgreen",
          clearIconMargin: "3px 8px 0 0",
          zIndex: 2,
        }}
      />
    </div>)
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