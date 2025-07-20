import { useRef, useEffect } from 'react';
import { useLoader, extend } from '@react-three/fiber';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import CubeEngine from '../../cubenets/CubeEngine';
import { COOKIE_MAT } from '../MatList';
import { buffer_mesh } from './meshLib';

extend({ TextGeometry });


const h = CubeEngine.HALF_UNIT;
const p = Math.PI;
const q = p * 0.5;


function FaceLabelTextMesh({ ref, label }) {
    const meshRef = useRef();
    const text = {
        D: 'Yum!',
        T: 'Sweet',
        F: 'Fresh',
        B: 'Butter',
        L: 'Oat',
        R: 'Soft',
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

    const s = 0.135;
    return (
        <group ref={ref} rotation={rotTable[label]}>
            <mesh ref={meshRef} 
                position={[0,0,-0.02]}
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {COOKIE_MAT.text.tag}
            </mesh>
        </group>
    );
}


function Dough({cubeRef, label}) {
    const ref = useRef();
    useEffect(() => {
        cubeRef.current.faces[label] = ref;
    // eslint-disable-next-line
    }, []);

    const interpPoints = (a, b, v) => {
        return [
            a[0] + (b[0] - a[0]) * v,
            a[1] + (b[1] - a[1]) * v,
            a[2] + (b[2] - a[2]) * v,
        ];
    }
    const cut = h * 0.3;
    const m = interpPoints(
        [h, 0, h],
        [-h, h * 2, -h],
        cut / 3
    );
    const vertices = [
        [h - cut, 0, h], [h, 0, h - cut], m,
    ];
    vertices.push(...vertices.map(p => [-p[0], p[1], +p[2]]));
    vertices.push(...vertices.map(p => [+p[0], p[1], -p[2]]));
    
    const indices = [
        0,1,2, 0,7,1, 0,6,7, 7,6,8, 0,3,6,
        3,5,4, 4,10,9, 3,4,9, 10,11,9, 3,9,6,
        2,5,11, 2,11,8,
        0,3,5, 0,5,2, 4,10,11, 4,11,5,
        1,2,8, 8,7,1, 11,9,8, 8,9,6,
    ];
    return (
        <group
            ref={ref}
            userData={{id: label}}
            onPointerOver={(e) => {
                e.stopPropagation();
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
            }}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            {buffer_mesh(vertices.flat(), indices, 
                COOKIE_MAT.dough.tag)
            }
        </group>);
};


export default function CookieSkin({cubeRef, label}) {
    const ref = useRef();

    const chocolateChip = (pos) => {
        return (
            <mesh position={pos} >
                <octahedronGeometry args={[0.06, 2]} />
                {COOKIE_MAT.choc.tag}
            </mesh>
        );
    };
    
    const rotChoc = {
        D: [0,0,0],
        T: [0,0,0],
        F: [0,0,0],
        B: [0,0,0],
        L: [0,-q,0],
        R: [0,+q,0],
    };

    const chocolateGroup = () => {
        return (
            <group rotation={rotChoc[label]}>
                {chocolateChip([-0.23,0.02,0.2])}
                {chocolateChip([0,0.02,0.12])}
                {chocolateChip([0.23,0.02,0.24])}
                {chocolateChip([0.39,0.02,0.01])}
                {chocolateChip([-0.32,0.02,-0.15])}
                {chocolateChip([0.1,0.02,-0.36])}
            </group>
        );
    };

    return (
        <group>
            <Dough cubeRef={cubeRef} label={label} />
            <FaceLabelTextMesh ref={ref} label={label} />
            {chocolateGroup()}
        </group>
    );
}