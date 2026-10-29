import { createRoot } from 'react-dom/client';
import './i18n';
import './styles.css';
import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Falta el elemento #root');
// Sin StrictMode a propósito: en desarrollo repetiría el emparejamiento y el código de un solo uso se gastaría dos veces.
createRoot(root).render(<App />);
