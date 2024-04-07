import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Main from './screens/Main'
import './App.css'
import Game from './screens/Game'
import { AppProvider } from './AppContext'
import Result from './screens/Result'
import WayToPlay from './screens/WayToPlay'
import AutomaticGame from './screens/AutomaticGame'

const App = () => {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/game/:id' element={<WayToPlay />} />
          <Route path='/game/manual/:id' element={<Game />} />
          <Route path='/game/automatic/:id' element={<AutomaticGame />} />
          <Route path='/result/:id' element={<Result />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}

export default App