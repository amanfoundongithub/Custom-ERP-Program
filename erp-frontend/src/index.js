import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// For binding the pages to the web
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import MainHomePage from './home/MainPage';
import Box from '@mui/material/Box';
import TopBar from './utils/TopBar';
import JournalPage from './journal/JournalPage';
import SignUpPage from './signup/SignUpPage';

import { useLocation } from 'react-router-dom';
import ProfilePage from './profile/ProfilePage';
import SignInPage from './login/SignInPage';


const Root = () => {

  const location = useLocation()
  const hideBar  = location.pathname.startsWith("/auth")

  return(
    <>
    {!hideBar && <TopBar />}
      <Routes>
        {/** The login part, here only signup is implemented */}
        <Route path='/auth/signup' element = {<SignUpPage />}/>
        <Route path='/auth/signin' element = {<SignInPage />}/>
        
        <Route path = '/profile' element = {<ProfilePage />} />

        <Route path='/home' element={<MainHomePage />} />
        <Route path='/journal' element = {<JournalPage />}/>
      </Routes>
  </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Root />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
