import * as THREE from "three";
import { au, degToRad, metersToUnits, minEntityRadius } from "./Math";
import { CelestialBody } from "./SolarSystem";

export default class Star
{
    star: THREE.Mesh;

    constructor(radius: number, color: number)
    {
        let visualRadius = Math.max(radius, minEntityRadius*8)
        let geometry = new THREE.SphereGeometry(visualRadius, 64, 32 );
        let material = new THREE.MeshBasicMaterial( {color: color} );
        let object = new THREE.Mesh(geometry, material);
        object.name = "Sun";
        this.star = object;
    }
}