import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import { AppStoreProvider } from './store/AppStore.jsx';
import './styles/global.css';

// Service worker: precaches the app shell and updates itself in the background.
registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppStoreProvider>
        <App />
      </AppStoreProvider>
    </BrowserRouter>
  </StrictMode>,
);
