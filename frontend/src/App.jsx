import React from 'react';
import './index.css'
import { useEffect,useState } from "react";
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import LogIn from './pages/Login/login';
import SignUp from './pages/signup/SignUp';
import Settings from './pages/settings/Settings';
import Profile from './pages/profile/Profile';
import { useAuthStore } from './store/useAuthStore';
import { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";


export default function App() {
  const {authUser,checkAuth} = useAuthStore();
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router> 
      <Navbar />
      <LoadingBar
          color="yellow"
          height={2}
          progress={progress}
          onLoaderFinished={() => setProgress(0)}
        />
      <div className='h-screen flex items-center justify-center'>
        
        <Routes>
          <Route path="/" element={authUser ? <Home setProgress = {setProgress}  /> : <Navigate to = "/login"/> }/>
          <Route path="/login" element={authUser ? <Navigate to = '/'/> : <LogIn setProgress = {setProgress} />} />
          <Route path="/signup" element={authUser ? <Navigate to='/'/>:<SignUp setProgress = {setProgress} />} />
          <Route path="/settings" element={authUser ? <Settings setProgress={setProgress} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={authUser ? <Profile setProgress = {setProgress} /> : <Navigate to="/login" /> } />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}
