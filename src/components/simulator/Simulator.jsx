import ControlPanel from './ControlPanel';
import R3FCanvas from './R3FCanvas';
import { Layout } from 'antd';

function Simulator() {
    return (
        <Layout style={{ height: '100vh' }}>
            <ControlPanel />
            <R3FCanvas />
        </Layout>
    );
}

export default Simulator;