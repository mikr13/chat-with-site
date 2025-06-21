
import "@workspace/ui/styles/globals.css";
import { createRoot } from 'react-dom/client';
import ChatPopup from './ChatPopup';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(<ChatPopup />);
