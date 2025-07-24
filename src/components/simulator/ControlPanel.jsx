import { useRef, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import NetSelector from './NetSelector';
import BaseSelector from './BaseSelector';
import ModeSelector from './ModeSelector';
import PlayerSlider from './PlayerSlider';
import RotationControler from './RotationControler';
import CubeEngine from '../../cubenets/CubeEngine';
import { Layout, Button, Divider, Typography } from 'antd';
import { PiVideoCameraFill } from 'react-icons/pi';

const { Sider } = Layout;

function AppTitle() {
    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            marginBottom: '6px',
            userSelect: 'none',
        }}>
            <img 
                src={`${process.env.PUBLIC_URL}/cube_icon.png`} 
                alt='app-icon' 
                style={{ width: 32, height: 32 }} 
            />
            <Typography.Title
                level={3}
                style={{
                    color: 'black',
                    fontFamily: "'Quantico', sans-serif",
                    margin: 0
                }}
            >
                Cube-Net Simulator
            </Typography.Title>
        </div>
    );
}

function ResetCameraButton() {
    const { camCtrlRef } = useAppContext();
    return (
        <Button 
            type='primary'
            onClick={() => camCtrlRef.current?.resetWithAnimation?.()}
            block
            icon={<PiVideoCameraFill />}
            style={{ marginTop: '12px'}}
        >
            Reset Camera
        </Button>
    );
}

function ControlPanel() {
    // eslint-disable-next-line
    const { cubeRef,
        cookie, ogre, chicken, 
        pipeline, rocket, cosmos 
    } = useAppContext();

    const cubeList = {
        1: cookie,
        2: chicken,
        3: pipeline,
        4: ogre,
        5: rocket,
        6: cosmos,
    };
    const posCache = useRef();

    const h = CubeEngine.HALF_UNIT;
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            if (!'123456'.includes(key)) {
                return;
            }
            const num = Number(key);
            
            if (posCache.current) {
                cubeRef.current.resetToCube();
                cubeRef.current.setPosition(posCache.current);
            }

            cubeRef.current = cubeList[key].current;
            cubeRef.current.setPosition([0, h, 2]);
            posCache.current = [7 - num * 2, h, 0];
        };
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup on unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line
    }, []);

    const divider = (text) => {
        const divider_s = {
            marginTop: '8px',
            marginBottom: '8px',
        };
        const span_s = {
            fontSize: '16px', 
            fontWeight: 'bold', 
            userSelect: 'none',
        };
        return (
            <Divider orientation='left' orientationMargin={0} style={divider_s}>
                <span style={span_s}>{text}</span>
            </Divider>
        );
    };

    return (
        <Sider width={320} style={{ background: '#fff', padding: '16px' }}>
            <AppTitle />
            {divider('Rotation Controls')}
            <RotationControler />

            {divider('Cube Net')}
            <NetSelector />

            {divider('Base Face Position')}
            <BaseSelector />

            {divider('Animation Mode')}
            <ModeSelector />
            
            {divider('Player Controls')}
            <PlayerSlider />
            
            <ResetCameraButton />
        </Sider>
    );
}

export default ControlPanel;
