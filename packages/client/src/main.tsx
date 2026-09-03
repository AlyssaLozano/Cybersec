import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './styles.css';
import './rooms.css';
import './career.css';
import './alerts.css';
import './incidents.css';
import './model-lab.css';
import './match.css';
import './home.css';
import './lobby.css';
import './badges.css';
import './portfolio.css';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element in index.html');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
