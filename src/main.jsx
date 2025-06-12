import { StrictMode, useState} from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import DogAdoptionProvider from './contexts/DogAdoptionProvider.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DogAdoptionProvider>
        <App />
    </DogAdoptionProvider>
    
  </StrictMode>
)
