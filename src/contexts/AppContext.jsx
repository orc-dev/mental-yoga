import { createContext, useContext, useState, useRef } from 'react';
import CubeEngine from '../cubenets/CubeEngine';
const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    
    const camCtrlRef = useRef(null);
    const sliderRef = useRef(null);

    const cubeRef = useRef();
    const coach = useRef(new CubeEngine({
        cubeType: 'coach',
        initPos: [-2, CubeEngine.HALF_UNIT, 0],
    }));
    const cookie = useRef(new CubeEngine({
        cubeType: 'cookie',
        initPos: [4, CubeEngine.HALF_UNIT, 0],
    }));
    const chicken = useRef(new CubeEngine({
        cubeType: 'chicken', 
        initPos: [2, CubeEngine.HALF_UNIT, 0],
    }));
    const pipeline = useRef(new CubeEngine({
        cubeType: 'pipeline', 
        initPos: [0, CubeEngine.HALF_UNIT, 3],
    }));

    const ogre = useRef(new CubeEngine({
        cubeType: 'ogre',
        initPos: [0, CubeEngine.HALF_UNIT, 0],
    }));
    const rocket = useRef(new CubeEngine({
        cubeType: 'rocket', 
        initPos: [-4, CubeEngine.HALF_UNIT, 0],
    }));
    const cosmos = useRef(new CubeEngine({
        cubeType:'cosmos', 
        initPos: [-6, CubeEngine.HALF_UNIT, 0],
    }));
    const [inCube, setInCube] = useState(true);

    return (
        <AppContext.Provider
            value={{
                camCtrlRef,
                sliderRef,
                cubeRef,
                coach,
                cookie,
                pipeline,
                ogre,
                rocket,
                chicken,
                cosmos,
                inCube, setInCube,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};