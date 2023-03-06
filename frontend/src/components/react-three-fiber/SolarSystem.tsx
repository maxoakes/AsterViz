import * as THREE from 'three'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Bounds, OrbitControls, useBounds } from '@react-three/drei'

// import * as Planets from "./planets.js";

export function SolarSystem()
{
    return (
        <>
            <mesh>
                <boxBufferGeometry />
                <meshBasicMaterial color="crimson" />
            </mesh>
        </>
    )
}