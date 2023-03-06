import {useEffect, useState} from "react";

export function SidePanel()
{
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="side-window" style={{display: isOpen ? "block" : "none", right: 0}} id="rightMenu">
        <button onClick={() => setIsOpen(current => !current)} className="transition-button full-width">Close &times;</button>
          <div id="entity-list">
            <div className="entity-list-item">
              <input type="checkbox" id="sun-toggle" name="sun-toggle" checked/>
              <label htmlFor="sun-toggle">Sun</label>
            </div>
            <p>List of all planets and asteroids in window</p>
            <p>'Add' button to add asteroid from the database</p>
            <p>Link to go to different page to search for asteroids in DB</p>
          </div>
        <button onClick={() => console.log("DB")} className="transition-button full-width">Go to Database Search</button>
      </div>
      <button className="side-window-button transition-button" onClick={() => setIsOpen(current => !current)}>icon</button>
    </>
    )
}