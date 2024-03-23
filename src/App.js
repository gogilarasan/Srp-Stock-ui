import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Container/Login/Login';
import Home from './Container/Home/Home';
import Lab from './Container/Lab/Lab';
import LabDetail from './Container/Lab/Details';
import Research from './Container/Research/Research';
import System from './Container/System/System';
import Stock from './Container/Stock/Stock';
import Timetable from './Container/Timetable/TimeTable';
import Report from './Container/Report/Report';
import Staff from './Container/Staff/Staff';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/Home' element={<Home />} />
        <Route path='/Stock' element={<Stock />} />
        <Route path='/System' element={<System />} />
        <Route path='/Lab' element={<Lab />} />
        <Route path='/Lab/Labdet' element={<LabDetail />} />
        <Route path='/Research' element={<Research />} />
        <Route path='/Staff' element={<Staff />} />
        <Route path='/Timetable' element={<Timetable />} />
        <Route path='/Report' element={<Report />} />
      </Routes>
    </Router>
  );
}

export default App;
