import { OrbitControls, PerspectiveCamera, useBounds } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { SolarSystem } from "./SolarSystem";

export function View()
{
    // document.getElementById('main-window').appendChild(renderer.domElement);
    // renderer.domElement.style.position = 'fixed';
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 1;

    // // init 3D scene
    // const scene = new THREE.Scene();
    // let camera = new THREE.PerspectiveCamera(
    //     40, // Field of view
    //     16 / 9, // Aspect ratio
    //     0.1, // Near plane
    //     10000 // Far plane
    // );
    // camera.position.set(-3,3,3);

    // // Init Grid
    // // show 1x1 unit grid for 100 units in x and z
    // // x=red, y=green, z=blue
    // const gridHelper = new THREE.GridHelper( 100, 100 );
    // scene.add( gridHelper );
    // const gridCheckbox = document.getElementById('grid-toggle');
    // gridCheckbox.addEventListener('change', () => {gridHelper.visible = gridCheckbox.checked});

    // // Init 3D Widget Axes
    // const axesHelper = new THREE.AxesHelper( 50 );
    // scene.add( axesHelper );
    // const axisCheckbox = document.getElementById('axis-toggle');
    // axisCheckbox.addEventListener('change', () => {axesHelper.visible = axisCheckbox.checked});

    const camera = useThree((state) => state.camera)
    useEffect(() => {
        console.log(camera)
      }, [camera])
      
    return (
        <>
            {/* <Suspense fallback={null}>
                <Bounds fit clip observe margin={1.2}>
                    <SelectToZoom>
                        <SolarSystem/>
                    </SelectToZoom>
                </Bounds>
            </Suspense> */}
            <SolarSystem/>
            <Axes isVisible={axesActive}/>
            <Grid isVisible={gridActive}/>
            <PerspectiveCamera fov={40} aspect={16 / 9} near={0.1} far={10000}/>
            <OrbitControls makeDefault enableDamping={false}/>
        </>
    )
}

function SelectToZoom({ children }: any)
{
    const api = useBounds()
    return (
        <group onClick={(e) => (e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit())} onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}>
            {children}
        </group>
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