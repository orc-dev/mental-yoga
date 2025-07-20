import { useRef, useEffect } from 'react';
import Face from './Face';
import { useFrame } from '@react-three/fiber';


function FoldableCube({ cubeRef, sliderRef }) {
    console.log('render.cube');
    
    const coreRef = useRef(null);
    useEffect(() => {
        cubeRef.current.core = coreRef;
        cubeRef.current.init = false;
    // eslint-disable-next-line
    }, []);

    useFrame((_, delta) => {
        cubeRef.current.setSliderRef(sliderRef);
        cubeRef.current.updateAnimation(delta);
    });
    
    return (
        <group ref={coreRef}>
            <Face label='T' cubeRef={cubeRef} />
            <Face label='D' cubeRef={cubeRef} />
            <Face label='F' cubeRef={cubeRef} />
            <Face label='B' cubeRef={cubeRef} />
            <Face label='L' cubeRef={cubeRef} />
            <Face label='R' cubeRef={cubeRef} />
        </group>
    );
}

export default FoldableCube;