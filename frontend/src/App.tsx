import {Link, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Match from './components/Match';
import {useEffect, useState} from "react";
import initialState from "./initialState";

function App() {


  useEffect(() => {
    console.log("-- App rerenders --");
  });

  return (
    <div>
      <nav>
        <div>
          <Home/>
        </div>
      </nav>
    </div>
  )
}

export default App
