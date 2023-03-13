import { AsteroidFromDatabase } from "App";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export function Database() {
    const [asteroids, setAsteroids] = useState<AsteroidFromDatabase[]>([]);
    const navigate = useNavigate();

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
            <div className="login-button">login</div>
			<div className="page-content">text</div>
            <div className="page-footer">
                <p className="text-center">Created by Max Oakes, 2023</p>
                <p className="text-center">Like this project? Check out some of Max's favorites: <a href="https://store.steampowered.com/app/314650/SpaceEngine/">Space Engine</a> and <a href="https://store.steampowered.com/app/220200/Kerbal_Space_Program/">Kerbal Space Program</a>.
                </p>
            </div>
		</div>
	);
}