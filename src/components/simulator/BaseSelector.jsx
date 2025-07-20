import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Radio } from 'antd';


function BaseSelector() {
    const { cubeRef } = useAppContext();
    const [selectedBaseId, setSelectedBaseId] = useState(0);

    const div_s = { 
        backgroundColor: 'rgb(244, 246, 255)',
        padding: '4px',
        paddingTop: '6px',
        paddingBottom: '12px',
        borderRadius: '8px',
    };

    return (
        <div style={div_s}>
            {/* A row of 6 radio circles */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <Radio
                        key={num}
                        value={num}
                        checked={selectedBaseId === (num - 1)}
                        onChange={() => {
                            setSelectedBaseId(num - 1);
                            cubeRef.current.setBaseId(num - 1);            
                        }}
                        style={{ display: 'block', margin: '0 auto' }}
                    />
                ))}
            </div>
            {/* A row of 6 text-labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} style={{ textAlign: 'center', width: '100%', userSelect: 'none' }}>
                        <span style={{ fontSize: 12 }}>{num}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BaseSelector;