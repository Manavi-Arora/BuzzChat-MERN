import React from 'react';
import './index.css'
import { useEffect } from "react";
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/home/Home';
import LogIn from './pages/Login/login';
import SignUp from './pages/Signup/SignUp';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from "react-hot-toast";



export default function App() {
  const {authUser,checkAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  

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
        <Toaster />
      </div>
    </Router>
  );
}
