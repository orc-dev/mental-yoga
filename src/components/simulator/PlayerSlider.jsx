import { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Checkbox } from 'antd';


function PlayerSlider() {
    const { cubeRef, sliderRef } = useAppContext();
    const [autoPlay, setAutoPlay] = useState(false);
    
    // Attach event listener to the raw JS slider
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const handleInput = (e) => {
            const value = Number(e.target.value);
            cubeRef.current.t100 = value;
        };

        slider.addEventListener('input', handleInput);
        return () => {
            slider.removeEventListener('input', handleInput);
        };
    // eslint-disable-next-line
    }, []);

    const div_s = { 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: 13 
    };
    const span_s ={
        cursor: 'pointer',
        color: 'black',
        fontWeight: 'bold',
    };
    
    const handleCheckBox = (e) => {
        const checked = e.target.checked;
        setAutoPlay(checked);
        cubeRef.current.setAutoPlay(checked);
    };

    const handleClickNet = () => {
        if (sliderRef.current && !autoPlay) {
            sliderRef.current.value = 0;
            cubeRef.current.t100 = 0;
        }
    };

    const handleClickCube = () => {
        if (sliderRef.current && !autoPlay) {
            sliderRef.current.value = 100;
            cubeRef.current.t100 = 100;
        }
    };

    const topDiv_s = { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        backgroundColor: 'rgb(244, 246, 255)',
        padding: '15px',
        borderRadius: '8px',
    };

    return (
        <div style={topDiv_s}>

            {/** check box: auto play */}
            <Checkbox
                checked={autoPlay}
                onChange={handleCheckBox}
                style={{ marginTop: '0px', marginBottom: '10px' }}
            >
                Auto Play
            </Checkbox>

            {/** raw JS slider: process control */}
            <input
                ref={sliderRef}
                type='range'
                min='0'
                max='100'
                defaultValue={100}
                step='1'
                disabled={autoPlay}
                style={{ width: '100%', marginBottom: '8px' }}
            />

            {/** Two clickable spans on each end */}
            <div style={div_s}>
                <span style={span_s} onClick={handleClickNet}>Net</span>
                <span style={span_s} onClick={handleClickCube}>Cube</span>
            </div>
        </div>
    );
}

export default PlayerSlider;