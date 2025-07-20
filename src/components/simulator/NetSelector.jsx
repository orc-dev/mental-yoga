import { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Select, Button } from 'antd';
import { VALID_NETS } from '../../cubenets/CubeNet';
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti';
import { FiShuffle } from 'react-icons/fi';


function NetSelector() {
    const { cubeRef } = useAppContext();
    const [currNetId, setCurrNetId] = useState(0);

    const randomNum = () => {
        return Math.floor(Math.random() * VALID_NETS.length);
    };

    const div_s = { 
        display: 'flex', 
        gap: '2px', 
        alignItems: 'center',
        backgroundColor: 'rgb(244, 246, 255)',
        padding: '15px',
        borderRadius: '8px',
    };

    const handleNetSelect = (value) => {
        setCurrNetId(value);
        const matrix = VALID_NETS[value].getOutputMatrix();
        cubeRef.current.setManifestMatrix(matrix);
    };

    return (
        <div style={div_s}>
            <Select
                style={{ width: '160px' }}
                placeholder='Choose a primitive net'
                value={currNetId}
                onChange={handleNetSelect}
            >
                {VALID_NETS.map((net, i) => (
                    <Select.Option key={i} value={i}>
                        {net.getNameCode()}
                    </Select.Option>
                ))}
            </Select>

            {/* Buttons */}
            <Button 
                type='primary' 
                icon={<TiArrowSortedUp />} 
                onClick={() => handleNetSelect(currNetId - 1)} 
                disabled={currNetId === 0}
            />
            <Button 
                type='primary' 
                icon={<TiArrowSortedDown />}
                onClick={() => handleNetSelect(currNetId + 1)}
                disabled={currNetId === VALID_NETS.length - 1}
            />
            <Button 
                type='primary' 
                icon={<FiShuffle />} 
                onClick={() => handleNetSelect(randomNum())} 
            />
        </div>
    );
}

export default NetSelector;
