import * as THREE from "three";
import { au, degToRad, metersToUnits, minEntityRadius } from "./helper";
import { CelestialBody } from "./helper";

export default class Entity
{
    type: CelestialBody;
    name: string;
    diameter: number;
    albedo: number; 
    eccentricity: number;
    semimajor_axis: number;
    perihelion: number; 
    inclination: number;
    asc_node_long: number;
    arg_periapsis: number;
    mean_anomaly: number;
    true_anomaly: number;
    classid: number;

    // derived
    semiMinorAxis: number;
    semiLatusRectum: number;
    focusDistance: number;

    // react things
    isVisible: boolean;

    constructor(type: CelestialBody, name: string, diameter: number, albedo: number, 
        eccentricity: number, semimajor_axis: number, perihelion: number, 
        inclination: number, asc_node_long: number, arg_periapsis: number, 
        mean_anomaly: number, true_anomaly: number, classid: number)
    {
        this.name = name;
        this.type = type;
        this.diameter = diameter;
        this.albedo = albedo;
        this.eccentricity = eccentricity;
        this.semimajor_axis = semimajor_axis;
        this.perihelion = perihelion;
        this.inclination = inclination;
        this.asc_node_long = asc_node_long;
        this.arg_periapsis = arg_periapsis;
        this.mean_anomaly = mean_anomaly;
        this.true_anomaly = true_anomaly;
        this.classid = classid;

        // math
        this.semiMinorAxis = (semimajor_axis * Math.sqrt(1-eccentricity**2))
        this.semiLatusRectum = semimajor_axis * (1-eccentricity**2)
        this.focusDistance = eccentricity*semimajor_axis

        this.isVisible = true;
    }
}