import { useRef, useEffect } from 'react';
import CubeEngine from '../cubenets/CubeEngine.js';
import ChickenSkin from './meshLibrary/ChickenSkin.jsx';
import OgreSkin from './meshLibrary/OgreSkin.jsx';
import RocketSkin from './meshLibrary/RocketSkin.jsx';
import CoachSkin from './CoachSkin.jsx';
import CookieSkin from './meshLibrary/CookieSkin.jsx';
import EdgeSkin from './EdgeSkin.jsx';
import VertexSkin from './VertexSkin.jsx';


function Face({ cubeRef, label }) {
    console.log('render.face');
    
    const ref = useRef();
    const xp = useRef();
    const xn = useRef();
    const zp = useRef();
    const zn = useRef();
    const bitmap = CubeEngine.BIT_FLAG[label];

    // Expose refs
    useEffect(() => {
        Object.assign(cubeRef.current.boneFaces[label], { 
            ref, xp, xn, zp, zn
        });
        const edgeList = [xp, zn, xn, zp];
        const neibFace = CubeEngine.FACE_AXIS_MAP[label];
        
        ['xp', 'zn', 'xn', 'zp'].forEach((key, i) =>
            cubeRef.current.boneFaces[label][neibFace[key]] = edgeList[i]
        );
        // eslint-disable-next-line
    }, []);


    const faceSkin = {
        coach: <CoachSkin cubeRef={cubeRef} label={label} />,
        cookie: <CookieSkin cubeRef={cubeRef} label={label} />,
        chicken: <ChickenSkin cubeRef={cubeRef} label={label} />,
        ogre: <OgreSkin cubeRef={cubeRef} label={label} />,
        rocket: <RocketSkin cubeRef={cubeRef} label={label} />,
    }
    const h = CubeEngine.HALF_UNIT;

    return (
        <group ref={ref} userData={{ label, bitmap }} >
            {/* Rotating Edge groups */}
            <group ref={xp} position={[+h, 0, 0]} />
            <group ref={xn} position={[-h, 0, 0]} />
            <group ref={zp} position={[0, 0, +h]} />
            <group ref={zn} position={[0, 0, -h]} />

            {/* Face Skin */}
            {faceSkin[cubeRef.current.cubeType]}

            {/* Edge skins */}
            {cubeRef.current.interactorFlag.edge && 
                <EdgeInteractorGroup cubeRef={cubeRef} label={label} />}

            {/* Vertex skins */}
            {cubeRef.current.interactorFlag.vertex && 
                <VertexInteractorGroup cubeRef={cubeRef} label={label} />}
        </group>
    );
}


function EdgeInteractorGroup({cubeRef, label}) {
    return (
        <group>
            <EdgeSkin cubeRef={cubeRef} faceLabel={label} axis='xp'/>
            <EdgeSkin cubeRef={cubeRef} faceLabel={label} axis='zn'/>
            <EdgeSkin cubeRef={cubeRef} faceLabel={label} axis='xn'/>
            <EdgeSkin cubeRef={cubeRef} faceLabel={label} axis='zp'/>
        </group>
    );
}


function VertexInteractorGroup({cubeRef, label}) {
    return (
        <group>
            <VertexSkin cubeRef={cubeRef} faceLabel={label} ax0='xp' ax1='zn'/>
            <VertexSkin cubeRef={cubeRef} faceLabel={label} ax0='zn' ax1='xn'/>
            <VertexSkin cubeRef={cubeRef} faceLabel={label} ax0='xn' ax1='zp'/>
            <VertexSkin cubeRef={cubeRef} faceLabel={label} ax0='zp' ax1='xp'/>
        </group>
    );
}


export default Face;
