import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

const init = () => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  requestAnimationFrame(() => {
    rootElement.classList.add('visible');
  });
};

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}