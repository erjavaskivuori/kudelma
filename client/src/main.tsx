import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { store } from './store';
import { loadColorRange } from './services/colorStorage';
import { applyColorRange } from './utils/colorManager';

const storedColorRange = loadColorRange();

if (storedColorRange) {
  applyColorRange(storedColorRange);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
