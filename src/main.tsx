import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { installLayoutGuard } from './utils/layoutGuard';

installLayoutGuard();

// Bỏ qua lỗi WebSocket đóng kết nối do môi trường container iFrame (Environment constraints)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const msg = String(event.reason?.message || event.reason || '');
    if (msg.includes('WebSocket') || msg.includes('websocket')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
