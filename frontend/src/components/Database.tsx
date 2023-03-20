import { Auth0Provider, GetTokenSilentlyOptions, useAuth0 } from "@auth0/auth0-react";
import { auth0Audience, auth0ClientID, auth0ClientSecret, auth0Domain } from "../App";
import axios from "axios";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../services/AuthService";
import { ProtectedRoute } from "./ProtectedRoute";
import { Table } from "./Table";
import { httpClient } from "../services/HttpService";

export function Database() {
    const navigate = useNavigate();

	return (
		<div className="page-container">
			<div className="back-button" onClick={() => navigate('/')}>
				<img src="./src/img/back128.png" className="button-icon"/>
				<img src="./src/img/aster128.png" className="button-icon"/>
			</div>
			<div className="title-banner"><h3 className="text-center">Database Search</h3></div>
			<div className="login-button">
			<AccountPanel/> 
			</div>
			<div className="page-content">
				<Table/>
				<CreateAsteroidForm/>
			</div>
			<div className="page-footer">
				<p className="text-center">Created by Max Oakes, 2023</p>
				<p className="text-center">Like this project? Check out some of Max's favorites: <a href="https://store.steampowered.com/app/314650/SpaceEngine/">Space Engine</a> and <a href="https://store.steampowered.com/app/220200/Kerbal_Space_Program/">Kerbal Space Program</a>.
				</p>
			</div>
		</div>
	);
}

export function CreateAsteroidForm()
{
	const { user, isAuthenticated, isLoading } = useAuth0();

	if (isLoading) {
		return <div>Loading ...</div>;
	}

	return (
		isAuthenticated ?
			<p className="text-center text-warning">You are logged in. Create an asteroid here. Not implemented</p> : 
			<p className="text-center text-danger">Log in to create an asteroid</p>
	);
}

export function AccountPanel()
{
	const { user, isAuthenticated, getAccessTokenSilently, isLoading, getIdTokenClaims } = useAuth0();
	const [userMetadata, setUserMetadata] = useState(null);
	const [idToken, setIdToken] = useState(null);

	useEffect(() => {
		const getUserMetadata = async () => {
	  
		  try {
			const accessToken = await getAccessTokenSilently({
			  authorizationParams: {
				audience: auth0Audience,
				scope: "read:current_user",
			  },
			});	  
			const metadataResponse = await axios(`https://${auth0Domain}/api/v2/users/${user.sub}`, {
			  headers: {
				Authorization: `Bearer ${accessToken}`,
			  },
			});
			const user_metadata  = await metadataResponse.data;
			setUserMetadata(user_metadata);

			const claims = await getIdTokenClaims();
			console.log(claims)
			setIdToken(claims.__raw)

			let res = await httpClient.post("/asteroid/create", 
			{
				fancy_name: "Test",
				pdes: "4",
				absmag: 0.5,
				diameter: 30,
				albedo: 0.2,
				eccentricity: 0.1,
				semimajor_axis: 1.0,
				perihelion: 1.0,
				inclination: 5.0,
				asc_node_long: 0.0,
				arg_periapsis: 0.0,
				mean_anomaly: 0.0,
			},
			{
				headers: {
				Authorization: `Bearer ${claims.__raw}`,
			}});
			await console.log(res.data)
			

		  } catch (e) {
			console.warn(e.message);
		  }
		};
		getUserMetadata();
	  }, [getAccessTokenSilently, user?.sub]);

	  useEffect(() => {
		console.log(userMetadata)
	  }, [userMetadata])

	  useEffect(() => {
		console.log(idToken)
	  }, [idToken])

	  if (isLoading)
	  {
		  return <div>Loading ...</div>
	  }

	return (
	<>
		<Auth0Login/>
		<Auth0Logout/>
		{isAuthenticated && userMetadata && (
			<>
				{userMetadata.nickname}
			</>
		)}
	</>)
}

export function Auth0Login()
{
	const { loginWithRedirect } = useAuth0();
	return <button onClick={() => loginWithRedirect()}>Log In</button>;
}

export function Auth0Logout()
{
	const { logout } = useAuth0();
	return (<button onClick={() => logout({ logoutParams: { returnTo: `${window.location.origin}/database` } })}>Log Out</button>);
}