import React from 'react'
import {BrowserRouter as Router, Route} from "react-router-dom"
import Image from './components/Image.js'
import Cam from './components/Cam.js'

function App() {
  return (
    <Router>
      <Route path="/" exact><Cam/></Route>
      <Route path="/:cam" ><Image /></Route>
    </Router>
  )
}

export default App