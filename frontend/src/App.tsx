import {Link, Route, Routes, useNavigate} from 'react-router-dom';
import { Home } from './components/Home';
import { Database } from './components/Database';
import { AuthProvider } from './services/AuthService';
import { Login, Logout } from './components/Login';
import { Auth0Provider } from '@auth0/auth0-react';

// @ts-ignore
export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
// @ts-ignore
export const auth0ClientID = import.meta.env.VITE_AUTH0_CLIENT_ID;
// @ts-ignore
export const auth0ClientSecret = import.meta.env.VITE_AUTH0_CLIENT_SECRET;
// @ts-ignore
export const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;
// @ts-ignore
export const minioIP = import.meta.env.VITE_MINIO_IP;
// @ts-ignore
export const minioPort = import.meta.env.VITE_MINIO_PORT;
// @ts-ignore
export const minioUrl = `http://${import.meta.env.VITE_MINIO_IP}:${import.meta.env.VITE_MINIO_PORT}`;

function App() {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) =>
  {
    navigate(appState?.returnTo || window.location.pathname);
    console.log('Callback!')
  }

  const providerConfig = {
    domain: auth0Domain,
    clientId: auth0ClientID,
    onRedirectCallback,
    authorizationParams: {
      redirect_uri: `${window.location.origin}/database`,
      audience: auth0Audience,
      scope: "read:current_user update:current_user_metadata"
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/database" element={
          <Auth0Provider {...providerConfig}>
            <Database/>
          </Auth0Provider>
        }/>
        {/* <Route path="/login" element={<Login/>}/>
        <Route path="/logout" element={<Logout/>}/> */}
      </Routes>
    </>
  )
}

export default App
