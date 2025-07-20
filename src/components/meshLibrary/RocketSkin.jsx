import { useRef, useEffect } from 'react';
import { useLoader, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import CubeEngine from '../../cubenets/CubeEngine';
import { useThree, useFrame } from '@react-three/fiber';
import { SIMPLE_MAT, ROCKET_MAT } from '../MatList';
import { sphere_mesh, cyl_mesh, buffer_mesh,torus_mesh, box_mesh, indices_4_to_3 } from './meshLib';
import * as THREE from 'three';
import HolographicMaterial from '../HolographicMaterial';


extend({ TextGeometry });


const h = CubeEngine.HALF_UNIT;
const p = Math.PI;
const q = 0.5 * p;

function FaceLabelTextMesh({ ref, label }) {
    const meshRef = useRef();
    const text = {
    D: 'Disclaimer', 
    T: 'Zap!',
    F: 'Fuel Up', 
    B: 'Boom', 
    L: 'GobAI™', 
    R: 'Profit',
};
    // Z-axis rotation (in radians) to orient face label text
    const rotTable = {
        D: [q,0,0],
        T: [q,0,0],
        F: [q,0,0],
        B: [q,0,p],
        L: [q,0,q],
        R: [q,0,-q],
    };

    const posY = {
        D: 0,
        T: 0,
        F: 0,
        B: 0,
        L: 0,
        R: 0,
    };
    // Load font once
    const options = {
        font: useLoader(FontLoader, './assets/droid_sans_bold.typeface.json'),
        size: 1,
        depth: 0.1,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5
    };

    useEffect(() => {
        if (meshRef.current) {
            // Compute bouding box to place the text in center of the face
            const geometry = meshRef.current.geometry;
            geometry.computeBoundingBox();

            const box = geometry.boundingBox;
            const xOffset = (box.max.x + box.min.x) / 2;
            const yOffset = (box.max.y + box.min.y) / 2;

            geometry.translate(-xOffset, -yOffset + posY[label], 0.16);
        }
    // eslint-disable-next-line
    });

    const s = label === 'D' ?  0.1 : 0.135;
    // const holoMat = new HolographicMaterial({
    //     fresnelOpacity: 0,
    //     fresnelAmount: 2,
    //     scanlineSize: 20,
    //     hologramBrightness: 1.5,
    //     depthTest: true,
    //     signalSpeed: 1,
    // });
    return (
        <group ref={ref} rotation={rotTable[label]}>
            <mesh ref={meshRef} 
                position={[0,0,-0.02]} 
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {SIMPLE_MAT.label}
            </mesh>
        </group>
    );
}

function BasicFrame({ cubeRef, label }) {

    const frame = () => {
        const c = 0.12; // cut
        const k = 0.06; // thickness
        const pts = [
            [h - c, 0, h], 
            [h - c - (Math.SQRT2 - 1) * k, 0, h - k]
        ];
        pts.push(...pts.map(v => [ v[2], 0, v[0]]));
        pts.push(...pts.map(v => [-v[0], 0, v[2]]));
        pts.push(...pts.map(v => [ v[0], 0,-v[2]]));

        const n = pts.length;
        for (let i = 1; i < n; i += 2) {
            const v = pts[i];
            pts.push([v[0], k, v[2]]);
        }

        const indices = [
            // horizontal surface
            0,1,3,2, 0,4,5,1, 4,6,7,5, 6,14,15,7, 
            14,12,13,15, 12,8,9,13, 8,10,11,9, 10,2,3,11,
            // vertical surface
            1,16,17,3, 1,5,18,16, 5,7,19,18, 7,15,23,19,
            15,13,22,23, 13,9,20,22, 9,11,21,20, 11,3,17,21,
            // slant surface
            0,16,17,2, 0,4,18,16, 4,6,19,18, 6,14,23,19,
            14,12,22,23, 12,8,20,22, 8,10,21,20, 10,2,17,21,
            // close face
            //16,18,19,23, 16,23,22,17, 17,22,20,21,
        ];
        
        const a = 0.1;
        const b = 0.45;
        
        const tri = (pos, rot) => {
            const c = 0.03;
            const pts = [
                [a,0,0], [b,0,0], [0,0,-a], [0,0,-b],
                [a,c,0-c], [b,c,0-c], [0+c,c,-a], [0+c,c,-b],
            ];
            const ind = [
                0,1,3,2, 
                4,5,7,6, 0,4,6,2, 0,1,5,4, 1,3,7,5, 3,2,6,7,
            ];

            return (
                <group>
                    {buffer_mesh(pts.flat(), indices_4_to_3(ind), 
                    ROCKET_MAT.m2.tag, pos, rot)}
                </group>
            );
        };

        const square = () => {
            const b = 0.45;
            const c = 0.12; // cut
            const y = 0.02;
            const pts = [
                [b - c, y, b], 
            ];
            pts.push(...pts.map(v => [ v[2], y, v[0]]));
            pts.push(...pts.map(v => [-v[0], y, v[2]]));
            pts.push(...pts.map(v => [ v[0], y,-v[2]]));
            
            const ind = [0,4,5,1, 0,2,6,4, 2,3,7,6];

            return (
                <group>
                    {buffer_mesh(pts.flat(), indices_4_to_3(ind), ROCKET_MAT.m3.tag)}
                </group>
            );
        };

        return <group>
            {buffer_mesh(pts.flat(), indices_4_to_3(indices), 
                ROCKET_MAT.green.tag,[0,0,0], [0,0,0])}
          

            {label !== 'F' && square()}
        </group>
    };

    return (
        <group>
            {frame()}
        </group>
    );
}


function TopFace() {
    const ref = useRef();
    return (
        <group>
            <BasicFrame label='T'/>
            <FaceLabelTextMesh ref={ref} label='T' />
        </group>
    );
}

function DownFace() {
    const ref = useRef();

    

    return (
        <group>
            <BasicFrame label='D' />
            <FaceLabelTextMesh ref={ref} label='D' />
            
        </group>
    );
}

function FrontFace() {
    const rocketRef = useRef();
    const ref = useRef();
    useFrame((_, delta) => {
        if (rocketRef.current) {
            rocketRef.current.rotation.z += delta * 3;
            // rocketRef.current.rotation.y += -delta * 1;
            //rocketRef.current.rotation.x = q;
        }
    });


    const foot = (rotZ) => {
        const y1 = -0.012;
        const y2 = -0.008;
        const y3 = -0.005;
        const vertices = [
            [0,y1,0],[0,y1,-0.035],[0.02,y2,-0.04],[0.04, y2, -0.015],
            [0.02,y3,-0.15],[0.03,y3,-0.15],
        ];
        vertices.push(...vertices.map(v => [v[0], -v[1], v[2]]));

        const indices = [
            0,1,2,3, 3,2,4,5, 6,7,8,9, 9,8,10,11, 
            0,3,9,6, 3,5,11,9, 1,2,8,7, 2,4,10,8,
            5,4,10,11,
        ];
        return (
            <group position={[0,0,0]} rotation={[0,0,rotZ]}>
                {buffer_mesh(vertices.flat(), indices_4_to_3(indices), 
                ROCKET_MAT.metal.tag, [0.06,0,-0.28], [0,0,0])}
            </group>
        );
    };

    
    const feet = () => {
        const start = q * 0.25;
        return (
            <group>
                {foot(start + q * 0)}
                {foot(start + q * 1)}
                {foot(start + q * 2)}
                {foot(start + q * 3)}
            </group>
        );
    };

    

    const Rocket = () => {
        return (
            <group ref={rocketRef} rotation={[0,0,0]}>
                {cyl_mesh(ROCKET_MAT.red.tag, [0,0.2,0.4, 8], [0,0,0.22], [q,0,0])}
                {cyl_mesh(ROCKET_MAT.red.tag, [0.1,0.1,0.3,8], [0,0,-0.1], [q,0,0])}
                {cyl_mesh(ROCKET_MAT.black.tag, [0.05, 0.05, 0.1, 8], [0,0,-0.3], [q,0,0])}
                {cyl_mesh(ROCKET_MAT.metal.tag, [0.07, 0.07, 0.05, 8], [0,0,-0.3], [q,0,0])}
                {feet()}
            </group>
        );
    };
    return (
        <group>
            <BasicFrame label='F' />
            <Rocket />
            {/* <FaceLabelTextMesh ref={ref} label='F' /> */}
        </group>
    );
}

function BackFace() {
    const ref = useRef();
    return (
        <group>
            <BasicFrame label='B' />
            <FaceLabelTextMesh ref={ref} label='B' />
        </group>
    );
}

function LeftFace() {
    const ref = useRef();
    return (
        <group>
            <BasicFrame label='L' />
            <FaceLabelTextMesh ref={ref} label='L' />
        </group>
    );
}

function RightFace() {
    const ref = useRef();
    return (
        <group>
            <BasicFrame label='R' />
            <FaceLabelTextMesh ref={ref} label='R' />
        </group>
    );
}


export default function RocketSkin({cubeRef, label}) {
    return {
        T: <TopFace/>,
        D: <DownFace/>,
        F: <FrontFace/>,
        B: <BackFace/>,
        L: <LeftFace/>,
        R: <RightFace/>,
    }[label];
}

