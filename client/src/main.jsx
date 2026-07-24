import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App.jsx';
import './index.css';
import { initClientApiAdapter } from './lib/clientApiAdapter';

// Initialize standalone client API adapter
initClientApiAdapter();

// Bind live Render API Gateway URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://life-os-8jxd.onrender.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
