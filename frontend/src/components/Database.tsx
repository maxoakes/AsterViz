import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../services/AuthService";
import { ProtectedRoute } from "./ProtectedRoute";
import { Table } from "./Table";

export function Database() {
    const navigate = useNavigate();
    const {token} = useAuth();

	useEffect(() => {
		console.log("Database Page Rendered");
	});

	return (
		<div className="page-container">
			<div className="back-button" onClick={() => navigate('/')}>
                <img src="./src/img/back128.png" className="button-icon"/>
                <img src="./src/img/aster128.png" className="button-icon"/>
            </div>
			<div className="title-banner"><h3 className="text-center">Database Search</h3></div>
            <div className="login-button">
            {
                token ? <AuthLinksView /> : <NoAuthLinksView/>
			}    
            </div>
			<div className="page-content">
                <Table/>
            </div>
            {
                token ?
                <p>You are logged in. Create an asteroid here</p> : <p>Log in to create an asteroid</p>
			}    
            <div className="page-footer">
                <p className="text-center">Created by Max Oakes, 2023</p>
                <p className="text-center">Like this project? Check out some of Max's favorites: <a href="https://store.steampowered.com/app/314650/SpaceEngine/">Space Engine</a> and <a href="https://store.steampowered.com/app/220200/Kerbal_Space_Program/">Kerbal Space Program</a>.
                </p>
            </div>
		</div>
	);
}

function AuthLinksView() {
	return (
		<>
			<Link to="/logout">Logout</Link>
		</>
	)
}

function NoAuthLinksView() {
	return (
		<>
			<Link to="/login">Login</Link>
		</>
	)
}