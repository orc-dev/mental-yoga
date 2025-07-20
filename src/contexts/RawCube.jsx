import { useEffect, useRef } from 'react';
import { useLoader, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
extend({ TextGeometry });

// Extend so we can use <axesHelper />
extend({ AxesHelper: THREE.AxesHelper });

const r = Math.PI / 2;
const DX = {
    down:  -0.365,
    top:   -0.195,
    front: -0.335,
    back:  -0.315,
    left:  -0.25,
    right: -0.325,
};

/** Y-offsets for positioning face label text on each cube face. */
const DY = {
    down:  -0.1,
    top:   -0.1,
    front: -0.1,
    back:  -0.1,
    left:  -0.1,
    right: -0.1,
};

/** Z-axis rotation (in radians) to orient face label text. */
const RZ = {
    down:  [+r,0,0],
    top:   [-r,0,0],
    front: [0,0,0],
    back:  [0,r*2,0],
    left:  [0,r*3,0],
    right: [0,r*1,0],
};


// Load font once
function RawCube() {
    const groupRef = useRef();
    const textOptions = {
        font: useLoader(FontLoader, './assets/droid_sans_bold.typeface.json'),
        size: 1,
        depth: 0.2,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!groupRef.current) return;

            const rotationAngle = THREE.MathUtils.degToRad(90); // 90 degrees
            const quaternion = new THREE.Quaternion();

            switch (event.key) {
            case 'ArrowLeft':
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -rotationAngle);
                groupRef.current.quaternion.multiplyQuaternions(quaternion, groupRef.current.quaternion);
                console.log('Quaternion after ArrowLeft:', groupRef.current.quaternion);
                break;

            case 'ArrowRight':
                quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationAngle);
                groupRef.current.quaternion.multiplyQuaternions(quaternion, groupRef.current.quaternion);
                console.log('Quaternion after ArrowRight:', groupRef.current.quaternion);
                break;

            case 'ArrowUp':
                quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -rotationAngle);
                groupRef.current.quaternion.multiplyQuaternions(quaternion, groupRef.current.quaternion);
                console.log('Quaternion after ArrowUp:', groupRef.current.quaternion);
                break;

            case 'ArrowDown':
                quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), rotationAngle);
                groupRef.current.quaternion.multiplyQuaternions(quaternion, groupRef.current.quaternion);
                console.log('Quaternion after ArrowDown:', groupRef.current.quaternion);
                break;

            default:
                break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);


    function faceLabelTextMesh(label, pos) {
        return (
            <group position={pos} rotation={RZ[label]}>
                <mesh position={[DX[label], DY[label], -0.02]} scale={[0.2, 0.2, 0.2]}>
                    <textGeometry attach='geometry' args={[label, textOptions]} />
                    <meshStandardMaterial color={'white'} side={THREE.DoubleSide} />
                </mesh>
            </group>
        );
    }

    return (
        <group ref={groupRef}>
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
            {faceLabelTextMesh('top',   [0,+0.5,0])}
            {faceLabelTextMesh('down',  [0,-0.5,0])}
            {faceLabelTextMesh('front', [0,0,+0.5])}
            {faceLabelTextMesh('back',  [0,0,-0.5])}
            {faceLabelTextMesh('left',  [-0.5,0,0])}
            {faceLabelTextMesh('right', [+0.5,0,0])}
        </group>
    );
}

export default RawCube;
