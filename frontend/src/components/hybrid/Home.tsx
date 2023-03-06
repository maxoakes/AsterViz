import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import SolarSystem from "./SolarSystem";

export default function Home()
{
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        console.log(ref.current);
        if (!ref.current) return;
        let frameRequest: number;
        const renderer = new THREE.WebGLRenderer({canvas: ref.current, antialias: true});
        
        // where all the good stuff happens
        const solarSystemScene = new SolarSystem(renderer);

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

    return (
        <canvas ref={ref}/>
    );
}
