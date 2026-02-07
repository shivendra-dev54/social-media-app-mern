import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import { Toaster } from 'react-hot-toast';
import "bootstrap/dist/css/bootstrap.min.css";
import './index.css';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toasterId="default"
        toastOptions={{
          className: '',
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: '#363636',
            color: '#fff',
          },

          success: {
            duration: 3000,
            iconTheme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <App />
    </StrictMode>
  </BrowserRouter>
)
