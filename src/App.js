import { useAppContext } from './contexts/AppContext.jsx';
import SessionRunner from './contexts/SessionRunner.jsx';
import Simulator from './components/simulator/Simulator.jsx';

function App() {
    
    return (<div>
        <Simulator />
    </div>);
}

export default App;
