import {Link, Route, Routes} from 'react-router-dom';
import { Home } from './components/Home';
import { Database } from './components/Database';

export type AsteroidFromDatabase = {
  absmag: number,
  albedo: number,
  arg_periapsis: number,
  asc_node_long: number,
  created_at: string,
  diameter: number,
  eccentricity: number
  fancy_name: string,
  full_name: string,
  id: number,
  inclination: number,
  mean_anomaly: number,
  neo: boolean
  pdes: number
  perihelion: number,
  pha: boolean,
  semimajor_axis: number,
  spkid: string
}

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/database" element={<Database/>}/>
		  </Routes>
    </>
  )
}

export default App
