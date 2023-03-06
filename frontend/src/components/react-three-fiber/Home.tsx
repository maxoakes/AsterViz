import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas, ThreeElements, useFrame, useThree } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";

// https://codesandbox.io/s/qxjoj?file=/src/App.js
export function Home()
{
  const [gridActive, setGridActive] = useState(true);
  const [axesActive, setAxesActive] = useState(true);

  return (
    <>
      <Canvas shadows={false}>
        <SolarSystem axesChecked={axesActive} gridChecked={gridActive}/>
      </Canvas>
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

export type SolarSystemProp = {
	axesChecked: boolean,
	gridChecked: boolean
}
export function SolarSystem({axesChecked, gridChecked}: SolarSystemProp)
{
    return (
        <>
            <ambientLight intensity={0.1} />
            <Box position={[0, 0, 0]} />
            <Axes isVisible={axesChecked}/>
            <Grid isVisible={gridChecked}/>
            <PerspectiveCamera fov={40} aspect={16 / 9} near={0.1} far={10000}/>
            <OrbitControls makeDefault enableDamping={false}/>
        </>
    )
}

function Box(props: ThreeElements['mesh'])
{
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
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 0xffffff : 0xffff00} />
        </mesh>
    )
}

type AxesProp = {isVisible: boolean}
function Axes({isVisible}: AxesProp)
{
    // args = [scale]
    return (
        <axesHelper args={[50]} visible={isVisible}/>
    )
}

type GridProp = {isVisible: boolean}
function Grid({isVisible}: GridProp)
{
    // args = [x-y length, num divisions]
    return (
        <gridHelper args={[100,100]} visible={isVisible}/>
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