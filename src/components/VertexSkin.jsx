import { useRef, useEffect } from 'react';
import CubeEngine from '../cubenets/CubeEngine';
import { VERTICES, OGRE_MAT } from './MatList';

const h = CubeEngine.HALF_UNIT;
const b = h * 0.75;
const posY = 0.025;
const vertexSkinPos = {
    xp: [+b, posY, -b],
    xn: [-b, posY, +b],
    zp: [+b, posY, +b],
    zn: [-b, posY, -b],
};

function VertexSkin({ cubeRef, faceLabel, ax0, ax1 }) {
    const meshRef = useRef();
   
    const f0 = CubeEngine.FACE_AXIS_MAP[faceLabel][ax0];
    const f1 = CubeEngine.FACE_AXIS_MAP[faceLabel][ax1];

    const id = faceLabel + f0 + f1;
    const bitmap = CubeEngine.BIT_FLAG[faceLabel] 
                 | CubeEngine.BIT_FLAG[f0] 
                 | CubeEngine.BIT_FLAG[f1];

    useEffect(() => {
        cubeRef.current.vertices[id] = meshRef;
        // eslint-disable-next-line
    }, []);

    const mat = {
        coach: VERTICES[faceLabel],
        ogre: OGRE_MAT.bodyV.tag,
    }[cubeRef.current.cubeType];
    
    return (
        <mesh
            ref={meshRef} 
            userData={{ id, bitmap }}
            position={vertexSkinPos[ax0]}
            onPointerOver={(e) => {
                e.stopPropagation();
                cubeRef.current.hover.vertex = id;
                cubeRef.current.handleVertexHover(id, 1);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                cubeRef.current.hover.vertex = null;
                cubeRef.current.handleVertexHover(id, 0, faceLabel);
            }}
            onClick={(e) => {
                e.stopPropagation();
                cubeRef.current.handleVertexClick(id, faceLabel);
                console.log(`Vertex clicked: ${id}`);
            }}
        >
            <cylinderGeometry args={[0.04,0.04,0.08]} />
            {mat}
        </mesh>
    );
}

export default VertexSkin;
