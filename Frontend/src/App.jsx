import React from 'react' 
import { Routes, Route } from 'react-router-dom'
import NotFound from './routers/NotFound'
import HomePage from './users/members/pages/HomePage'
function App() {

  return (
    <Routes>
       <Route path="/" element={<HomePage />} />
       <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
