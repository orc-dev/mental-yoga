import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useLoader, extend } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { useThree, useFrame } from '@react-three/fiber';
import { SIMPLE_MAT, POP_MAT } from '../MatList';
import CubeEngine from '../../cubenets/CubeEngine';
import SinTimer from '../../cubenets/SinTimer';
import { 
    sphere_mesh, cyl_mesh, buffer_mesh, pipe_mesh,
    box_mesh, indices_4_to_3, cap_mesh, 
    ring_mesh} from './meshLib';

extend({ TextGeometry });

// Global constants
const h = CubeEngine.HALF_UNIT;
const p = Math.PI;
const q = 0.5 * p;

// Return a list of points in 4 quadrants
function get4Pts(pts) {
    const temp = [...pts];
    temp.push(...temp.map(v => [-v[0], v[1], v[2]]));
    temp.push(...temp.map(v => [v[0], v[1], -v[2]]));
    return temp;
}

// Compute the position of the bricks
const computePos = (x=0.45, nrow=12, ncol=6, gap=0.01) => {
    const lenZ = ((x * 2) - gap * (nrow + 1)) / nrow;
    const lenX = ((x * 2) - gap * (ncol + 1)) / (ncol - 0.5);

    const pos = [];
    let posX = -0.45 + gap;
    let posZ = -0.45 + gap + lenZ / 2;

    const widthX = (r, c) => {
        const head = (r % 2 === 1) && (c === 0);
        const tail = (r % 2 === 0) && (c === ncol - 1);
        const isHalf = (head || tail);
        return isHalf ? (lenX * 0.5) : lenX;
    };

    for (let r = 0; r < nrow; ++r) {
        posX = -0.45;
        let lastXwidth = 0;

        for (let c = 0; c < ncol; ++c) {
            const thisXwidth = widthX(r, c);
            posX += (lastXwidth + thisXwidth) / 2 + gap;
            pos.push([posX, posZ, thisXwidth]);
            lastXwidth = thisXwidth;
        }
        posZ += (lenZ + gap);
    }
    return {lenZ, pos};
};

const { lenZ, pos: posBrick } = computePos();


function BasicFaceSkin({cubeRef, label}) {
    // Pipes
    const w = 0.25;
    const pipe = (pos, rot) => {
        const r = 0.04;
        const R = 0.065;
        const minR = 0.035;
        const L = 0.47;
        const l = 0.07;
        const mat = POP_MAT.pipe.tag;

        return (
            <group position={pos} rotation={rot}>
                {pipe_mesh(mat, r, minR, L, r)}
                {pipe_mesh(mat, R, minR, l, R, [0,0.21,0])}
                {sphere_mesh(mat, [R], [0,-w,0])}
            </group>
        );
    };

    // Mortar
    const x = 0.45;
    const mortar = () => {
        const pts = [...get4Pts([[x,0,x]])];
        const idx = [0,1,2, 1,3,2];
        return buffer_mesh(pts.flat(), idx, POP_MAT.coffee.tag);
    };
    
    // Brick wall
    const brickWall = () => {
        return (
             <Instances limit={posBrick.length}>
                <boxGeometry args={[1, 1, 1]} />
                {POP_MAT.brick.tag}
                {posBrick.map(([x, z, widthX], i) => (
                    <Instance
                        key={i}
                        position={[x, 0, z]}
                        scale={[widthX, 0.02, lenZ]}
                    />
                ))}
            </Instances>
        );
    };
    
    const rotCoe = ['L', 'R'].includes(label) ? q : 0;
    return (
        <group>
            {pipe([+w,0,-h], [ p,0, q])}
            {pipe([+h,0,+w], [-q,q, 0])}
            {pipe([-w,0,+h], [ 0,0,-q])}
            {pipe([-h,0,-w], [ q,-q,0])}

            {/* The brick wall */}
            {mortar()}
            <group rotation={[0,rotCoe,0]}>
                {brickWall()}
            </group>
        </group>
    );
}


function FaceLabelTextMesh({ ref, label }) {
    const meshRef = useRef();
    const text = {
        D: "1980's",
        T: '',
        F: 'Sewer',
        B: 'Bricks',
        L: 'Kick',
        R: 'Retro',
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
                position={[0,0,-0.01]}
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {SIMPLE_MAT.label}
            </mesh>
        </group>
    );
}


function Top({cubeRef}) {
    const textRef = useRef();

    return (
        <group>
            <BasicFaceSkin cubeRef={cubeRef} label='T'/>
            <FaceLabelTextMesh ref={textRef} label='T' />
        </group>
    );
}

function Down({cubeRef}) {
    const textRef = useRef();
    return (
        <group>
            <BasicFaceSkin cubeRef={cubeRef} label='D'/>
            <FaceLabelTextMesh ref={textRef} label='D'/>
        </group>
    );
}


function Front({cubeRef}) {
    const textRef = useRef();
    return (
        <group>
            <BasicFaceSkin cubeRef={cubeRef} label='F'/>
            <FaceLabelTextMesh ref={textRef} label='F' />
        </group>
    );
}


function Back({cubeRef}) {
    const textRef = useRef();
    return (
        <group>
            <BasicFaceSkin cubeRef={cubeRef} label='B'/>
            <FaceLabelTextMesh ref={textRef} label='B' />
        </group>
    );
}


function Left({cubeRef}) {
    const textRef = useRef();
    return (
        <group>
            <BasicFaceSkin cubeRef={cubeRef} label='L'/>
            <FaceLabelTextMesh ref={textRef} label='L' />
        </group>
    );
}


function Right({cubeRef}) {
    const textRef = useRef();
    return (
        <group>
            <BasicFaceSkin cubeRef={cubeRef} label='R'/>
            <FaceLabelTextMesh ref={textRef} label='R' />
        </group>
    );
}


export default function PipelineSkin({ cubeRef, label }) {
    return {
        T: <Top cubeRef={cubeRef} />,
        D: <Down cubeRef={cubeRef} />,
        F: <Front cubeRef={cubeRef} />,
        B: <Back cubeRef={cubeRef} />,
        L: <Left cubeRef={cubeRef} />,
        R: <Right cubeRef={cubeRef} />,
    }[label];
};