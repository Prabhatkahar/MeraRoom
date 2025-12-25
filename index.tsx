import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Register Service Worker for PWA with enhanced error handling
const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    // Only register if we're on the primary domain or localhost to avoid origin mismatch
    const isSupportedHost = ['meraroom.web.app', 'localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isSupportedHost) {
      try {
        const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
        console.log('MeraRoom: SW Registered:', registration.scope);
      } catch (err) {
        console.debug('MeraRoom: SW Registration ignored in this environment:', err.message);
      }
    }
  }
};

const init = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  registerSW();
};

init();