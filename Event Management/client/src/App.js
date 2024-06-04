import React, { Component, } from 'react';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';
import ForgotPasswordForm from './ForgotPasswordForm.js';
import EventPlatform from './EventPlatform'
import Profile from './Profile'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<SigninForm />}></Route>
          <Route path='/SigninForm' element={<SigninForm />}></Route>
          <Route path='/SignupForm' element={<SignupForm />}></Route>
          <Route path='/ForgotPasswordForm' element={<ForgotPasswordForm />}></Route>
          <Route path='/EventPlatform' element={<EventPlatform />}></Route>
          <Route path='/Profile' element={<Profile />}></Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;