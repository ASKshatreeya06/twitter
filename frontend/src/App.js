
import { useState } from 'react';
import './App.css';
import Body from './components/Body';
import Login from './components/Login';
import Toaster from 'react-hot-toast'
import { useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Feed from './components/Feed';

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/home' element={<Home />} >
          <Route path='' element={<Feed />} />
          <Route path='profile/:id' element={<Profile />} />


        </Route>
        <Route path='/login' element={<Login />} />
        {/* {user ? <Body /> : <Login />} */}
        {/* <Body /> */}

      </Routes>
      <Toaster />

    </>
  );
}

export default App;
