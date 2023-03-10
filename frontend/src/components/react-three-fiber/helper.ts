export const km = 1000
export const au = 149597870700
export const minEntityRadius = 0.01
export const sunRadius = 695700000 //meters

export function metersToUnits(meters: number)
{
    return meters/au;
}

export function unitsToMeters(meters: number)
{
    return au*meters
}

export function radToDeg(radian: number)
{
    return radian*(180/Math.PI);
}

export function degToRad(degrees: number)
{
    return degrees*(Math.PI/180);
}

export enum CelestialBody {
    Star = -1,
    Planet = 0,
    Asteroid = 1,
}