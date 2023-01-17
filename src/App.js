import './App.css';
import axios from 'axios';
import {useState, useEffect} from 'react'
import NavigationBar from './components/NavigationBar';
import Main from './components/Main';
import Storage from './components/Storage';

import { Route, Routes } from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar></NavigationBar>
        <Routes>
          <Route exact path="/" element={<Main/>}></Route>
          <Route exact path="/settings" element={<Storage/>}></Route>
        </Routes>
      </header>
    </div>
  );
}

export default App;
