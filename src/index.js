import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppContextProvider } from './contexts/AppContext.jsx';
import App from './App';
import 'antd/dist/reset.css';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( 
    <AppContextProvider>
        <App />
    </AppContextProvider>
);
