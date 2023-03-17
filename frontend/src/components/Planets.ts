export interface SolarSystemPlanetDataType {
    name: string,
    neo: boolean,
    pha: boolean,
    absmag: number,
    diameter: number,
    albedo: number,
    eccentricity: number,
    semimajor_axis: number,
    perihelion: number,
    inclination: number,
    asc_node_long: number,
    arg_periapsis: number,
    mean_anomaly: number,
    true_anomaly: number,
    classid: number
} 

export const solarSystemPlanetData = {
    'Mercury': {
        name: 'Mercury',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 4880, //km
        albedo: 0.088,
        eccentricity: 0.20563,
        semimajor_axis: 0.387098, //au
        perihelion: 0.307499, //au
        inclination: 7.005, //deg
        asc_node_long: 48.331, //deg
        arg_periapsis: 29.124,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Venus': {
        name: 'Venus',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 6051.800*2, //km
        albedo: 0.689,
        eccentricity: 0.006772,
        semimajor_axis: 0.723332, //au
        perihelion: 0.718440, //au
        inclination: 3.39458, //deg
        asc_node_long: 76.680, //deg
        arg_periapsis: 54.884,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Earth': {
        name: 'Earth',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 6371*2, //km
        albedo: 0.367,
        eccentricity: 0.0167086,
        semimajor_axis: 1.0, //au
        perihelion: 0.983292404576, //au
        inclination: 7.155, //deg
        asc_node_long: -11.26064, //deg
        arg_periapsis: 114.20783,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Mars': {
        name: 'Mars',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 3389.500*2, //km
        albedo: 0.170,
        eccentricity: 0.0934,
        semimajor_axis: 1.52368055, //au
        perihelion: 1.3814, //au
        inclination: 1.850, //deg
        asc_node_long: 49.57854, //deg
        arg_periapsis: 286.5,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Jupiter': {
        name: 'Jupiter',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 69911*2, //km
        albedo: 0.503,
        eccentricity: 0.0489,
        semimajor_axis: 5.2038, //au
        perihelion: 4.9506, //au
        inclination: 1.303, //deg
        asc_node_long: 100.464, //deg
        arg_periapsis: 273.867,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Saturn': {
        name: 'Saturn',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 58232*2, //km
        albedo: 0.342,
        eccentricity: 0.0565,
        semimajor_axis: 9.5826, //au
        perihelion: 9.0412, //au
        inclination: 2.485, //deg
        asc_node_long: 113.665, //deg
        arg_periapsis: 339.392,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Uranus': {
        name: 'Uranus',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 25362*2, //km
        albedo: 0.300,
        eccentricity: 0.04717,
        semimajor_axis: 19.19126, //au
        perihelion: 18.2861, //au
        inclination: .773, //deg
        asc_node_long: 74.006, //deg
        arg_periapsis: 96.998857,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Neptune': {
        name: 'Neptune',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 24622*2, //km
        albedo: 0.290,
        eccentricity: 0.008678,
        semimajor_axis: 30.07, //au
        perihelion: 29.81, //au
        inclination: 1.770, //deg
        asc_node_long: 131.783, //deg
        arg_periapsis: 273.187,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'Pluto': {
        name: 'Pluto',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 1188.3*2, //km
        albedo: 0.52,
        eccentricity: 0.2488,
        semimajor_axis: 39.482, //au
        perihelion: 29.658, //au
        inclination: 17.16, //deg
        asc_node_long: 110.299, //deg
        arg_periapsis: 113.834,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: -1
    },
    'sample': {
        name: 'Hyakutake',
        neo: false,
        pha: false,
        absmag: 0.0,
        diameter: 2.2, //km
        albedo: 0.1,
        eccentricity: 0.9998946,
        semimajor_axis: 1700,
        perihelion: 0.2301987, //au
        inclination: 124.92246, //deg
        asc_node_long: 188.05766,
        arg_periapsis: 130.17218,
        mean_anomaly: 0,
        true_anomaly: 0,
        classid: 0
    }
}