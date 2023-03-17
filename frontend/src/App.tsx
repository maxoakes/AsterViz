import {Link, Route, Routes} from 'react-router-dom';
import { Home } from './components/Home';
import { Database } from './components/Database';

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
