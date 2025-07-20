import { useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import NetSelector from './NetSelector';
import BaseSelector from './BaseSelector';
import ModeSelector from './ModeSelector';
import PlayerSlider from './PlayerSlider';
import RotationControler from './RotationControler';
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
    const { cubeRef, coach, cookie, ogre, chicken, rocket } = useAppContext();

    useEffect(() => {
        cubeRef.current = ogre.current;
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
