import {Link, Route, Routes} from 'react-router-dom';
import { Home } from './components/Home';
import { Database } from './components/Database';
import { AuthProvider } from './services/AuthService';
import { Login, Logout } from './components/Login';

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/database" element={<Database/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Logout/>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App
