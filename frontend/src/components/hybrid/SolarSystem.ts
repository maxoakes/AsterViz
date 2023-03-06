import React from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GUI } from 'dat.gui'
import Entity from "./Entity.js";
import { metersToUnits } from "./Math.js";
import { solarSystemPlanetData } from "./Planets.js";
import Star from "./Star.js";

export enum CelestialBody {
    Star = -1,
    Planet = 0,
    Asteroid = 1,
}

export const unitDictionary = {
    diameter: " km",
    semimajor_axis: " AU",
    perihelion: " AU",
    inclination: " deg",
    asc_node_long: " deg",
    arg_periapsis: " deg",
    mean_anomaly: " deg",
    true_anomaly: " deg"
};

export default class SolarSystem
{
    public scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public camera: THREE.PerspectiveCamera;
    public grid: THREE.GridHelper;
    public axes: THREE.AxesHelper;
    public sun: Star;
    public planets: Entity[];
    public asteroids: Entity[];
    public selectedEntity: Entity | undefined;

    constructor(renderer: THREE.WebGLRenderer)
    {
        // init the scene
        this.scene = new THREE.Scene();
        this.renderer = renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        console.log("In constructor for solar system renderer")

        this.camera = new THREE.PerspectiveCamera(
            40, // Field of view
            16 / 9, // Aspect ratio
            0.1, // Near plane
            10000 // Far plane
        );
        this.camera.position.set(-3,3,3);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = false;

        // helpers
        // show 1x1 unit grid for 100 units in x and z
        // x=red, y=green, z=blue
        this.grid = new THREE.GridHelper( 100, 100 );
        this.scene.add( this.grid );

        // Init 3D Widget Axes
        this.axes = new THREE.AxesHelper( 50 );
        this.scene.add( this.axes );

        // build the scene
        this.asteroids = [];
        this.planets = [];
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
                this.planets.push(newPlanetObject);
            else
                this.asteroids.push(newPlanetObject);
        }
        this.sun = new Star(metersToUnits(695700000), 0xffff00);

        this.populateScene();

        window.addEventListener('resize', this.resize);
        this.resize();
    }

    resize = () =>
    {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.camera.updateProjectionMatrix();
        console.log(`Window Resized to ${this.camera.aspect}`)
    }

    populateScene = () =>
    {
        console.log("Refeshing Scene")
        this.selectedEntity = undefined;
        this.scene.clear();
        this.scene.add(this.sun.star);
        this.asteroids.forEach(asteroid => {
            this.scene.add(asteroid.entityBody);
            this.scene.add(asteroid.entityOrbit);
        });
        this.planets.forEach(planet => {
            this.scene.add(planet.entityBody);
            this.scene.add(planet.entityOrbit);
        })
    }
    //     const raycaster = new THREE.Raycaster();
    //     let intersectedObject;

    //     let selectableObjects = [];
    //     document.addEventListener('mouseup', onRightClick)
    //     function onRightClick(event)
    //     {
    //         if (event.button !== 2) return; //only do things on right-click
    //         // if it is a right-click, create a raycast from the camera to the mouse pointer, and get all objects it intersects
    //         raycaster.setFromCamera({x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1, y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1}, camera)
    //         let intersects = raycaster.intersectObjects(selectableObjects, false)

    //         if (intersects.length > 0)
    //         {
    //             // display info about
    //             if (intersectedObject)
    //             {
    //                 intersectedObject.material = intersectedObject.userData.originalMaterial;
    //             }
    //             intersectedObject = intersects[0].object;
    //             intersectedObject.material = new THREE.MeshBasicMaterial({color: 0xff0000});

    //             console.log(intersectedObject);
    //             let root = document.getElementById('info-viewer');
    //             while (root.firstChild)
    //             {
    //                 root.removeChild(root.lastChild);
    //             }
    //             for (let property in intersectedObject.userData.orbitalElements)
    //             {
    //                 let title = property;
    //                 let value = intersectedObject.userData.orbitalElements[property]
    //                 let container = document.createElement('div');
    //                 if (property == 'name')
    //                 {
    //                     let titleText = document.createElement('p');
    //                     titleText.className = 'entity-title'
    //                     titleText.textContent = value;
    //                     container.appendChild(titleText);
    //                 }
    //                 else
    //                 {
    //                     container.className = 'info-container';
    //                     let titleText = document.createElement('p');
    //                     titleText.className = 'info-title';
    //                     titleText.innerText = title;
    //                     let valueText = document.createElement('p');
    //                     valueText.className = 'info-string';
    //                     valueText.innerText = value;

    //                     container.appendChild(titleText);
    //                     container.appendChild(valueText);
    //                 }
    //                 root.appendChild(container);
    //             }
    //         }
    //         else
    //         {
    //             intersectedObject = null
    //         }
    //     }

    //     function updateSelected(object)
    //     {
    //         console.log(object)
    //     }

    //     let entities = [];

    //     function populateSceneList()
    //     {
    //         function addEntityToList(entity) {
    //             console.log(entity.name)
    //             // create the container div
    //             let container = document.createElement('div');
    //             container.className = 'entity-list-item';

    //             // create the checkbox
    //             let thisName = `${entity.name}-toggle`
    //             let checkbox = document.createElement('input');
    //             checkbox.type = 'checkbox';
    //             checkbox.name = thisName
    //             checkbox.checked = true;

    //             // create the label text
    //             let label = document.createElement('label');
    //             label.textContent = entity.name
    //             label.setAttribute('for', thisName)

    //             // create secondary text
    //             let focus = document.createElement('button');
    //             focus.type = 'submit';
    //             focus.className = 'focus-button';
    //             focus.textContent = 'Focus';

    //             root.appendChild(container);
    //             container.appendChild(focus)
    //             container.appendChild(checkbox)
    //             container.appendChild(label)
                
    //             focus.onclick = function() {
    //                 console.log(camera)
    //                 controls.target = new THREE.Vector3(entity.position.x, entity.position.y, entity.position.z)
    //                 controls.update()
    //                 console.log(controls.getDistance())
    //             }

    //             checkbox.addEventListener('change', () => {
    //                 entity.visible = checkbox.checked
    //                 // also make the orbit invis
    //             });
    //         }

    //         // find the root HTML element and remove all children
    //         const root = document.getElementById('entity-list')
    //         while (root.firstChild)
    //         {
    //             root.removeChild(root.lastChild);
    //         }
    //         // search box to add objects
    //         let searchContainer = document.createElement('div');
    //         let bar = document.createElement('input');
    //         bar.className = 'entity-search-bar'
    //         bar.type = 'text';
    //         bar.placeholder = 'Search for an Asteroid by Name'

    //         let searchButton = document.createElement('button');
    //         searchButton.type = 'submit';
    //         searchButton.className = 'search-button';
    //         searchButton.textContent = 'search'
    //         root.appendChild(searchContainer)
    //         searchContainer.appendChild(bar)
    //         searchContainer.appendChild(searchButton)

    //         // add all entities to the list
    //         entities.forEach(addEntityToList)
    //     }
    //     populateSceneList()
}

