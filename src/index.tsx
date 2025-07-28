import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Request notification permission
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    console.log('Notification permission:', permission);
  });
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);