import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Button, Tooltip } from 'antd';
import {
    FaArrowRotateLeft,
    FaArrowUpLong,
    FaArrowRotateRight,
    FaArrowLeftLong,
    FaArrowDownLong,
    FaArrowRightLong,
} from 'react-icons/fa6';
import { TbArrowsRandom } from 'react-icons/tb';
import { HiMiniCube } from 'react-icons/hi2';
import CubeEngine from '../../cubenets/CubeEngine';

function RotationController() {
    const { cubeRef } = useAppContext();
    const [disableReset, setDisableReset] = useState(true);

    const icons = {
        zp: <FaArrowRotateLeft />,
        xn: <FaArrowUpLong />,
        zn: <FaArrowRotateRight />,
        yn: <FaArrowLeftLong />,
        xp: <FaArrowDownLong />,
        yp: <FaArrowRightLong />,
    };

    const labels = {
        zp: 'Tilt Left',
        xn: 'Rotate Up',
        zn: 'Tilt Right',
        yn: 'Rotate Left',
        xp: 'Rotate Down',
        yp: 'Rotate Right',
    };

    const placement = {
        zp: 'top',
        xn: 'top',
        zn: 'top',
        yn: 'bottom',
        xp: 'bottom',
        yp: 'bottom',
    };

    const button = (op) => (
        <Tooltip title={labels[op]} placement={placement[op]}>
            <Button
                icon={icons[op]}
                type='primary'
                onClick={() => {
                    cubeRef.current.rotate(op);
                    setDisableReset(cubeRef.current.nextPose === 'TF');
                }}
                style={{
                    width: '40px',
                    height: '32px',
                    fontSize: '13px',
                    borderRadius: op[0] === 'z' ? '50%' : '8px',
                    transition: 'transform 0.2s ease',
                }}
            />
        </Tooltip>
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '1rem',
                alignItems: 'center',
                backgroundColor: 'rgb(244, 246, 255)',
                padding: '15px',
                borderRadius: '8px',
            }}
        >
            {/* Arrow Controls (left side) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {button('zp')}
                    {button('xn')}
                    {button('zn')}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {button('yn')}
                    {button('xp')}
                    {button('yp')}
                </div>
            </div>

            {/* Side Buttons (right side) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <Tooltip title={'Rotate the cube to a random pose.'} placement={'right'}>
                    <Button
                        type='default'
                        icon={<TbArrowsRandom/>}
                        onClick={() => {
                            const randNum = Math.floor(Math.random() * 24);
                            const nextPose = Object.keys(CubeEngine.CUBE_GROUP)[randNum];
                            cubeRef.current.rotateTo(nextPose);
                            setDisableReset(cubeRef.current.nextPose === 'TF');
                        }}
                        style={{
                            width: '103%',
                            height: '32px',
                            fontSize: '13px',
                            fontWeight: 500,
                            borderRadius: '8px',
                        }}
                    >
                        Random
                    </Button>
                </Tooltip>
                
                <Tooltip title={'Reset the cube to the original pose.'} placement={'right'}>
                    <Button
                        type='default'
                        icon={<HiMiniCube />}
                        onClick={() => {
                            cubeRef.current.rotateTo('TF');
                            setDisableReset(true);
                        }}
                        style={{
                            width: '103%',
                            height: '32px',
                            fontSize: '13px',
                            fontWeight: 500,
                            borderRadius: '8px',
                        }}
                        disabled={disableReset}
                    >
                        Reset
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
}

export default RotationController;
