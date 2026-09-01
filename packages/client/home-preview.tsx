import { createRoot } from 'react-dom/client';
import { Home } from './src/components/Home';
import './src/styles.css';
import './src/home.css';

const noop = () => {};
const el = document.getElementById('root');
if (el) {
  createRoot(el).render(
    <Home
      username="coach"
      paid={false}
      onSignOut={noop}
      onTakeAssessment={noop}
      onRisk={noop}
      onLinux={noop}
      onSoc={noop}
      onBrowseTracks={noop}
      onSocWarRoom={noop}
      onRedBlueWarRoom={noop}
      onRiskWarRoom={noop}
      onAiWarRoom={noop}
      onPortfolio={noop}
      onInterviewSim={noop}
      onInterviewPeer={noop}
    />,
  );
}
