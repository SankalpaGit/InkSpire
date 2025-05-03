import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
// import RouteTransition from './routers/RouteTransition'
import './App.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  < Router>
    {/* <RouteTransition> */}
    <StrictMode>
      <App />
    </StrictMode>
    {/* </RouteTransition> */}
  </Router>
)