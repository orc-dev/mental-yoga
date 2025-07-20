import { useRef, useEffect } from 'react';
import { useLoader, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import CubeEngine from '../cubenets/CubeEngine.js';
import { COACH_MAT, SIMPLE_MAT } from './MatList.jsx';
extend({ TextGeometry });


const h = CubeEngine.HALF_UNIT;
const p = Math.PI;
const q = p * 0.5;


function CoachSkin({cubeRef, label}) {
    const skin = useRef();
    
    // Expose refs
    useEffect(() => {
        Object.assign(cubeRef.current.boneFaces[label], { skin });
        // eslint-disable-next-line
    }, []);

    return (
        <group ref={skin} rotation={[q, 0, 0]}>
            {/* Face surface square mesh */}
            <mesh
                onPointerOver={(e) => {e.stopPropagation()}}
                onPointerOut={(e) => {e.stopPropagation()}}
                onClick={(e) => {e.stopPropagation()}}
            >
                <planeGeometry args={[h * 2, h * 2]} />
                {COACH_MAT[label]}
            </mesh>
            {/* Face label text mesh*/}
            <FaceLabelTextMesh cubeRef={cubeRef} label={label} />
        </group>
    );
};


function FaceLabelTextMesh({ cubeRef, label }) {
    const meshRef = useRef();
    const textRef = useRef();
    
    // Expose refs
    useEffect(() => {
        Object.assign(cubeRef.current.boneFaces[label], { textRef });
        // eslint-disable-next-line
    }, []);
    
    const text = {
        D: 'Down',
        T: 'Top',
        F: 'Front',
        B: 'Back',
        L: 'Left',
        R: 'Right',
    }
    // Load font once
    const options = {
        font: useLoader(FontLoader, './assets/droid_sans_bold.typeface.json'),
        size: 1,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5
    };
    // Z-axis rotation (in radians) to orient face label text
    const rotZ = {
        D: 0,
        T: 0,
        F: 0,
        B: p,
        L: q,
        R: -q,
    };

    useEffect(() => {
        if (meshRef.current) {
            console.log('adjusting text pos...');
            // Compute bouding box to place the text in center of the face
            const geometry = meshRef.current.geometry;
            geometry.computeBoundingBox();

            const box = geometry.boundingBox;
            const xOffset = (box.max.x + box.min.x) / 2;
            const yOffset = (box.max.y + box.min.y) / 2;

            geometry.translate(-xOffset, -yOffset, 0);
        }
    }); // runs on every re-render

    const s = 0.15;
    return (
        <group ref={textRef} rotation={[0, 0, rotZ[label]]}>
            <mesh 
                ref={meshRef} 
                position={[0, 0, -0.02]} 
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {SIMPLE_MAT.label}
            </mesh>
        </group>
    );
}


export default CoachSkin;
