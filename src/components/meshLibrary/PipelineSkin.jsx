import { useRef, useEffect } from 'react';
import { useLoader, extend } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { POP_MAT } from '../MatList';
import CubeEngine from '../../cubenets/CubeEngine';
import { box_mesh, cyl_mesh, buffer_mesh, pipe_mesh } from './meshLib';

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

///////////////////////////////////////////////////////////////////////////////
// Brick Wall
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


const brickWall = (label) => {
    const rotY = ['L', 'R'].includes(label) ? q : 0;
    const { lenZ, pos: posBrick } = computePos();
    const mat = POP_MAT.brick.tag;

    return (
        <group rotation={[0,rotY,0]}>
            <Instances limit={posBrick.length}>
                <boxGeometry args={[1, 1, 1]} />
                {mat}
                {posBrick.map(([x, z, widthX], i) => (
                    <Instance
                        key={i}
                        position={[x, 0, z]}
                        scale={[widthX, 0.02, lenZ]}
                    />
                ))}
            </Instances>
        </group>
    );
};

///////////////////////////////////////////////////////////////////////////////
// Pipe edge for interaction
const posPipe = {
    xp: [+h,  0,+h/2],
    zn: [+h/2,0,-h  ],
    xn: [-h,  0,-h/2],
    zp: [-h/2,0,+h  ],
};

const rotPipe = {
    xp: [-q, q, 0],
    zn: [ p, 0, q],
    xn: [ q,-q, 0],
    zp: [ 0, 0,-q],
};

function Pipe({ cubeRef, mainFace, edge }) {
    const pipeRef = useRef();
    const neibFace = CubeEngine.FACE_AXIS_MAP[mainFace][edge];
    const id = mainFace + neibFace;
    const bitmap = CubeEngine.BIT_FLAG[mainFace] 
                 | CubeEngine.BIT_FLAG[neibFace];

    const r = 0.04;
    const R = 0.065;
    const L = 0.47;
    const l = 0.07;
    const mat = POP_MAT.pipe.tag;

    useEffect(() => {
        cubeRef.current.edges[id] = pipeRef;
        // eslint-disable-next-line
    }, []);

    return (
        <group 
            ref={pipeRef} 
            userData={{ id, bitmap }}
            position={posPipe[edge]} 
            rotation={rotPipe[edge]}
            onPointerOver={(e) => {
                e.stopPropagation();
                cubeRef.current.handleEdgeHover(id, 1, mainFace);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                cubeRef.current.handleEdgeHover(id, 0, mainFace);
            }}
            onClick={(e) => {
                e.stopPropagation();
                cubeRef.current.handleEdgeClick(id, mainFace);
            }}
        >
            {cyl_mesh(mat, [r,r,L])}
            {cyl_mesh(mat, [R,R,l], [0,0.21,0])}
        </group>
    );
};


function BasicFaceSkin({cubeRef, label}) {
    // Mortar
    const x = 0.45;
    const mortar = () => {
        const pts = [...get4Pts([[x,0,x]])];
        const idx = [0,1,2, 1,3,2];
        return (
            <group
                onPointerOver={(e) => e.stopPropagation() }
                onPointerOut={(e) => e.stopPropagation() }
                onClick={(e) => e.stopPropagation() }
            >
                {buffer_mesh(pts.flat(), idx, POP_MAT.mortar.tag)}
            </group>
        );
    };
    
    // Ending spheres
    const sphereGroup = () => {
        const R = 0.065;
        const posList = [...get4Pts([[h,0,h]])];
        return (
            <Instances limit={4}>
                <sphereGeometry args={[R]} />
                {POP_MAT.pipe.tag}
                {posList.map((pos, i) => (
                    <Instance key={i} position={pos} />
                ))}
            </Instances>
        );
    };

    return (
        <group>
            {/* The pipelines */}
            <Pipe cubeRef={cubeRef} mainFace={label} edge='xp' />
            <Pipe cubeRef={cubeRef} mainFace={label} edge='zn' />
            <Pipe cubeRef={cubeRef} mainFace={label} edge='xn' />
            <Pipe cubeRef={cubeRef} mainFace={label} edge='zp' />
            {sphereGroup()}
            
            {/* The brick wall */}
            {mortar()}
            {brickWall(label)}
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
        L: 'New York',
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

    const s = 0.12;
    return (
        <group ref={ref} rotation={rotTable[label]}>
            <mesh ref={meshRef} 
                position={[0,0,-0.015]}
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text[label], options]}/>
                {POP_MAT.text.tag}
            </mesh>
        </group>
    );
}


function pattern(mat) {
    const a = 0.0425;
    const y = -0.01;
    const nums = [6,5,4,3];
    const sign = 1;
    let dirZ = true;
    let posZ = 0.078;
    const ptn = [];

    for (let i = 0; i < 4; ++i) {
        let dir = dirZ;
        ptn.push({ pos: [0, y, posZ], dir, sign });

        for (let j = 1; j < nums[i]; ++j) {
            dir = !dir;
            const x = a * j;
            ptn.push({ pos: [+x, y, posZ], dir, sign });
            ptn.push({ pos: [-x, y, posZ], dir, sign });
        }
        posZ += a;
        dirZ = !dirZ;
    }

    ptn.push(...ptn.map(({pos, dir, sign}) => (
        {pos: [pos[0], pos[1], -pos[2]], dir, sign}))
    );

    ptn.push(...ptn.map(({pos, dir, sign}) => (
        {pos, dir, sign: -sign}))
    );

    const unitGeo = [(a * 0.2), -0.02, (a * 0.8)];
    return (
        <Instances limit={ptn.length}>
            <boxGeometry args={unitGeo} />
            {mat}
            {ptn.map(({pos, dir, sign}, i) => {
                const offset = sign * a * 0.225;
                const posI = [...pos];
                const rotI = [0,0,0];

                if (dir) {
                    posI[0] += offset;
                } else {
                    posI[2] += offset;
                    rotI[1] = q;
                }
                return (
                    <Instance key={i} position={posI} rotation={rotI}/>
                );
            })}
        </Instances>
    );
};


function Cover() {
    const coverTextRef = useRef();
    const mat = POP_MAT.cover.tag;
    const matDark = POP_MAT.coverDark.tag;
    const R = 0.25;
    const r = R - 0.015;
    const thick = 0.05;
    const Rm = R + 0.015;

    useEffect(() => {
        if (coverTextRef.current) {
            // Compute bouding box to place the text in center of the face
            const geometry = coverTextRef.current.geometry;
            geometry.computeBoundingBox();

            const box = geometry.boundingBox;
            const xOffset = (box.max.x + box.min.x) / 2;
            const yOffset = (box.max.y + box.min.y) / 2;

            geometry.translate(-xOffset, -yOffset, 0.16);
        }
    // eslint-disable-next-line
    });

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
    
    const coverText = () => {
        const s = 0.055;
        const text = 'CITY SEWER';
        return (
            <mesh ref={coverTextRef} 
                position={[0,0,-0.003]}
                rotation={[q,0,0]}
                scale={[s,s,s]} 
                raycast={() => null}
            >
                <textGeometry attach='geometry' args={[text, options]}/>
                {mat}
            </mesh>
        );
    };
    
    const bars = () => {
        const args = [R * 1.85,0.01,0.012];
        return (
            <group>
                {box_mesh(mat, args, [0, -0.015, +0.05])}
                {box_mesh(mat, args, [0, -0.015, -0.05])}
            </group>
        );
    }

    return (
        <group position={[0,0,0]}>
            <group rotation={[0,p/24,0]}>
                {pipe_mesh(mat, R, r, thick, Rm)}
                {cyl_mesh(matDark, [r, r, 0.033])}
            </group>
            {coverText()}
            {bars()}
            {pattern(mat)}
        </group>
    );
};


function Top({cubeRef}) {
    const textRef = useRef();
    return (
        <group>
            <BasicFaceSkin cubeRef={cubeRef} label='T'/>
            <FaceLabelTextMesh ref={textRef} label='T' />
            <Cover/>
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