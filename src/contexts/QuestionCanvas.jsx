import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { useAppContext } from './AppContext';
import FoldableCube from '../components/FoldableCube';


const styles = {
    canvasBox: {
        width: '220vw',
        aspectRatio: '16 / 9',
        border: '1px solid white',
        //borderRadius: '16px',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '0px',
        borderBottomRightRadius: '0px',
        borderBottomLeftRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        margin: '30px',
        marginRight: '0px',
    },
};

const CAMERA_DEFALUT_POS = [1.5, 4, 3];

function CamControls() {
    const { camera, gl } = useThree();
    const { camCtrlRef } = useAppContext();
    const isAnimating = useRef(false);
    const targetPosition = useRef(new THREE.Vector3(...CAMERA_DEFALUT_POS));
    const targetLookAt = new THREE.Vector3(0,0,0);
    const targetQuaternion = useRef(new THREE.Quaternion());

    useEffect(() => {
        const controls = camCtrlRef.current;
        if (!controls) return;

        // Initial position and target
        camera.lookAt(0,0,0);
        controls.target.set(0,0,0);
        controls.saveState();

        // Precompute target quaternion
        const dummyCam = camera.clone();
        dummyCam.position.copy(targetPosition.current);
        dummyCam.lookAt(targetLookAt);
        targetQuaternion.current.copy(dummyCam.quaternion);

        controls.resetWithAnimation = () => {
            isAnimating.current = true;
        };
    // eslint-disable-next-line
    }, [camera, camCtrlRef]);

    useFrame((_, delta) => {
        const controls = camCtrlRef.current;
        if (!controls || !isAnimating.current) return;
    
        // Smoothly update camera.position and controls.target
        easing.damp3(camera.position, targetPosition.current, 0.3, delta);
        easing.damp3(controls.target, targetLookAt, 0.3, delta);
    
        controls.update();
    
        // Stop animating when both position and target are "close enough"
        if (
            camera.position.distanceTo(targetPosition.current) < 0.01 &&
            controls.target.distanceTo(targetLookAt) < 0.01
        ) {
            camera.position.copy(targetPosition.current);
            controls.target.copy(targetLookAt);
            controls.update(); // ensure OrbitControls knows

            isAnimating.current = false;
            controls.saveState();
        }
    });
    
    return (
        <OrbitControls
            ref={camCtrlRef}
            args={[camera, gl.domElement]}
            enableDamping
            dampingFactor={0.1}
        />
    );
}

function Env() {
    const presetList = [
        'apartment',
        'city',
        'dawn',
        'forest',
        'lobby',
        'night',
        'park',
        'studio',
        'sunset',
        'warehouse'
    ];
    return <Environment preset={presetList[8]} background backgroundBlurriness={0.6} />
}

function GridAndGround({visible}) {
    const gridProps = {
        infiniteGrid: true, 
        cellSize: 1, 
        cellThickness: 0.5 - 0.1, 
        sectionSize: 3, 
        sectionThickness: 1.35, 
        sectionColor: [0.5, 0.5, 10], 
        fadeDistance: 30, 
        receiveShadow: true,
    };
    const meshPos = [0, -0.001, 0];
    const meshRot = [-Math.PI * 0.5, 0, 0];
    return (
        <group visible={visible} >
            <Grid {...gridProps} />
            <mesh position={meshPos} rotation={meshRot} receiveShadow>
                <planeGeometry args={[30, 30]} />
                <meshBasicMaterial transparent />
                <shadowMaterial transparent opacity={0.4} />
            </mesh>
        </group>
    );
}

function QuestionCanvas({ cubeRef }) {

    const cameraProps = { position: CAMERA_DEFALUT_POS, fov: 75 };
    
    return (
        <div style={styles.canvasBox}>
            <Canvas dpr={[1, 2]} shadows camera={cameraProps}>
                {/* <fogExp2 attach="fog" args={['#aaa', 0.05]} />
                <color attach="background" args={['#aaa']} /> */}
                {/* Environment */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[3, 3, 3]} />
                <CamControls />
                <Env />
                <GridAndGround visible={true} />
                {/* Scene objects */}
                
                {/* <RawCube /> */}
                <FoldableCube cubeRef={cubeRef}/>

            </Canvas>
        </div>
    );
}

export default QuestionCanvas;