import { useState } from "react";

export default function Home() {
  return (
    <div>
      <Window/>
      <SidePanel/>
      <InfoView/>
      <Buttons/>
    </div>
  );
}

export function Window()
{
  return (<div id="main-window"></div>)
}

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

export function InfoView()
{
  return (
    <div id="info-viewer">
      <div>
        <p className="entity-title">Title</p>
      </div>
      <div className="info-container">
        <p className="info-title">Title</p>
        <p className="info-string">String</p>
      </div>
      <div className="info-container">
        <p className="info-title">Title</p>
        <p className="info-string">String</p>
      </div>
      <div className="info-container">
        <p className="info-title">Title</p>
        <p className="info-string">String</p>
      </div>
    </div>
  )
}

export function Buttons()
{
  return (
    <div id="buttons">
      <div className="widget-item">
        <input type="checkbox" id="grid-toggle" name="grid-toggle" checked/>
        <label htmlFor="grid-toggle">Show Reference Plane Grid</label>
      </div>
      <div className="widget-item">
        <input type="checkbox" id="axis-toggle" name="axis-toggle" checked/>
        <label htmlFor="axis-toggle">Show Center 3D Axes</label>
      </div>
    </div>
  )
}