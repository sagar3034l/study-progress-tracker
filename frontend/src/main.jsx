import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router'
import UseContext from './context/UseContext'

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
  <UseContext>
    <App />
  </UseContext>
  </BrowserRouter> 
)
