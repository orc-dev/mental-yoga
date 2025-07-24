import { createContext, useContext, useRef } from 'react';
import CubeEngine from '../cubenets/CubeEngine';
const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
    
    const camCtrlRef = useRef(null);
    const sliderRef = useRef(null);

    const h = CubeEngine.HALF_UNIT;

    const cubeRef = useRef();
    const coach = useRef(new CubeEngine());

    const cookie = useRef(new CubeEngine({
        cubeType: 'cookie',
        initPos: [5, h, 0],
    }));
    const chicken = useRef(new CubeEngine({
        cubeType: 'chicken', 
        initPos: [3, h, 0],
    }));
    const pipeline = useRef(new CubeEngine({
        cubeType: 'pipeline', 
        initPos: [1, h, 0],
    }));

    const ogre = useRef(new CubeEngine({
        cubeType: 'ogre',
        initPos: [-1, h, 0],
    }));
    const rocket = useRef(new CubeEngine({
        cubeType: 'rocket', 
        initPos: [-3, h, 0],
    }));
    const cosmos = useRef(new CubeEngine({
        cubeType:'cosmos', 
        initPos: [-5, h, 0],
    }));

    return (
        <AppContext.Provider
            value={{
                camCtrlRef,
                sliderRef,
                cubeRef,
                coach,

                cookie,
                chicken,
                pipeline,
                ogre,
                rocket,
                cosmos,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};