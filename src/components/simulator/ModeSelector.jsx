import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Radio, Tooltip } from 'antd';


function ModeSelector() {
    const {cubeRef } = useAppContext();
    const [animationMode, setAnimationMode] = useState('compact');

    const div_s = { 
        display: 'flex', 
        gap: '6px', 
        alignItems: 'center',
        backgroundColor: 'rgb(244, 246, 255)',
        padding: '15px',
        borderRadius: '8px',
    };

    const radio_s = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    };

    return (
        <div style={div_s}>
            <Radio.Group
                value={animationMode}
                onChange={(e) => {
                    setAnimationMode(e.target.value);
                    cubeRef.current.setAnimationMode(e.target.value);
                }}
                style={radio_s}
            >
                <Tooltip title='Animate from base face to leaf face'>
                    <Radio value='rootFirst'>Waving</Radio>
                </Tooltip>

                <Tooltip title='Animate from leav face to base face'>
                    <Radio value='leaveFirst'>Rolling</Radio>
                </Tooltip>

                <Tooltip title='Animate all faces together'>
                    <Radio value='compact'>Blossom</Radio>
                </Tooltip>
            </Radio.Group>
        </div>
    );
}

export default ModeSelector;