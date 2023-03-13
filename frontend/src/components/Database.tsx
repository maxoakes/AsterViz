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
		</div>
	);
}