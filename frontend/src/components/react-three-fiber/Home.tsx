import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useRef } from "react";
import { InfoView } from "./InfoView";
import { SidePanel } from "./SidePanel";
import { View } from "./View";

export function Home()
{
    const [gridActive, setGridActive] = useState(true);
    const [axesActive, setAxesActive] = useState(true);

    return (
        <>
            <Canvas>
                <View/>
            </Canvas>
            <SidePanel/>
            <InfoView/>
            <div id="buttons">
                <WidgetButton name="grid-toggle" text="Show Reference Plane Grid" isChecked={gridActive} onToggleClick={() => setGridActive(!gridActive)}/>
                <WidgetButton name="axes-toggle" text="Show Center 3D Axes" isChecked={axesActive} onToggleClick={() => setAxesActive(!axesActive)}/>
            </div>
        </>
    );
}

export type WidgetButtonProp = {
	name: string,
	text: string,
	isChecked: boolean,
  onToggleClick: () => void,
}
export function WidgetButton({name, text, isChecked, onToggleClick}: WidgetButtonProp)
{
  return (
    <div className="widget-item">
      <input type="checkbox" id={name} name={name} onClick={onToggleClick} checked={isChecked} />
      <label htmlFor={name}>{text}</label>
    </div>
  )
}