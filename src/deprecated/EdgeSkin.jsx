// import { useRef, useEffect, useState, useMemo } from 'react';
// import * as THREE from 'three';
// import CubeEngine from '../cubenets/CubeEngine';

// const h = CubeEngine.HALF_UNIT;
// const b = h * 0.85;

// const FACE_COLOR = {
//     D: 0x76D4Dc,
//     T: 0xFDFBFE,
//     F: 0xD1AEBA,
//     B: 0xA17470,
//     L: 0xc9b8a3,
//     R: 0xf54e38,
// };

// const edgeSkinPos = {
//     xp: [+b, 0, 0],
//     xn: [-b, 0, 0],
//     zp: [0, 0, +b],
//     zn: [0, 0, -b],
// };

// function EdgeSkin({ cubeRef, faceLabel, axis }) {
//     const groupRef = useRef();
//     const meshRef = useRef();

//     const [hovered, setHovered] = useState(false);
//     const [selected, setSelected] = useState(false);

//     const neibFace = CubeEngine.FACE_AXIS_MAP[faceLabel][axis];
//     const id = faceLabel + neibFace;
//     const bitmap = CubeEngine.BIT_FLAG[faceLabel] | CubeEngine.BIT_FLAG[neibFace];

//     const xLen = axis[0] === 'x' ? h * 0.11 : h * 1.65;
//     const zLen = axis[0] === 'x' ? h * 1.65 : h * 0.11;

//     const defaultHeight = 0.001;
//     const hoverHeight = 0.015;
//     const selectedHeight = 0.015;

//     useEffect(() => {
//         cubeRef.current.edges[id] = groupRef;
//         // eslint-disable-next-line
//     }, []);

//     const height = selected
//         ? selectedHeight
//         : hovered
//         ? hoverHeight
//         : defaultHeight;

//     // eslint-disable-next-line
//     const geometryArgs = useMemo(() => [xLen, height, zLen], [height]);

//     const color = selected
//         ? 'orange'
//         : hovered
//         ? 'yellow'
//         : FACE_COLOR[faceLabel];

//     const emissive = color;
//     const emissiveIntensity = selected ? 1.2 : hovered ? 1.0 : 0;

//     return (
//         <group
//             ref={groupRef}
//             userData={{ id, bitmap }}
//             position={edgeSkinPos[axis]}
//             onPointerOver={(e) => {
//                 e.stopPropagation();
//                 setHovered(true);
//             }}
//             onPointerOut={(e) => {
//                 e.stopPropagation();
//                 setHovered(false);
//             }}
//             onClick={(e) => {
//                 e.stopPropagation();
//                 setSelected((prev) => !prev);
//                 console.log(`Clicked on edge ${id}`);
//             }}
//         >
//             <mesh ref={meshRef} position={[0, 0, 0]}>
//                 <boxGeometry args={geometryArgs} />
//                 <meshStandardMaterial
//                     color={color}
//                     emissive={emissive}
//                     emissiveIntensity={emissiveIntensity}
//                     side={THREE.DoubleSide}
//                     metalness={0.5}
//                     roughness={0.5}
//                     flatShading={false}
//                 />
//             </mesh>
//         </group>
//     );
// }

// export default EdgeSkin;

