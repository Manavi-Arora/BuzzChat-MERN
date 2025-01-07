import React from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home';
import LogIn from './pages/login/Login';
import SignUp from './pages/signup/SignUp';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';
import { useAuthStore } from './store/useAuthStore';

export default function App() {
  const {authUser,checkAuth} = useAuthStore();
  return (
    <Router> 
      <div className='h-screen flex items-center justify-center'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}
