import React from "react";
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"; 
import Home from './Container/Home/Home';
import Lab from './Container/Lab/Lab';
import LabDetail from './Container/Lab/Details';
import Research from './Container/Research/Research';
import System from './Container/System/System';
import Stock from './Container/Stock/Stock';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/Stock' element={<Stock/>}/>
          <Route path='/System' element={<System/>}/>
          <Route path='/Lab' element={<Lab/>}/>
          <Route path='/Lab/Labdet' element={<LabDetail/>}/>
          <Route path='/Research' element={<Research/>}/>
      </Routes>
    </Router>
  );
}

export default App;
