import React from "react";
import { Link } from "react-router-dom";
import { Mail, UserRoundPen,Lock,LockKeyhole,EyeClosed,Eye } from "lucide-react"
import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore"
import toast from "react-hot-toast";

const SignUp = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPass: ""
  });
  
  const { signup, isSigningUp} = useAuthStore();
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (!formData.confirmPass) return toast.error("Confirm Password is required");
    if (formData.password.length < 8) return toast.error("Password must be at least 8 characters");
    if (formData.confirmPass != formData.password) return toast.error("Passwords do not match");
    props.setProgress(20);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.setProgress(50);
    const isValid = validateForm();
    props.setProgress(70);
    if (isValid === true) signup(formData);
    props.setProgress(100);
  };

  return (
    
    <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
        <h1 className='text-3xl font-semibold text-center text-gray-800'>
          Sign Up <span className='text-yellow-500' style={{ textShadow: '2px 2px 5px black, -2px -2px 5px black' }}> BuzzChat</span>
        </h1>

        <form className="my-2" onSubmit={handleSubmit}>

          <div>
            <label className='label p-2'>
              <span className='text-black text-base label-text'>User Name</span>
            </label>
            <div className="relative">
              <input type='text' placeholder='John Doe' className='w-full input input-bordered  h-10' value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} autoComplete="username" />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
                <UserRoundPen color="#fbbf24" />
              </div>
            </div>

          </div>

          <div>
            <label className='label p-2'>
              <span className='text-base text-black label-text'>Email</span>
            </label>
            <div className="relative">
              <input type='text' autoComplete="username" placeholder='you@example.com' className='w-full input input-bordered h-10' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
                <Mail color="#fbbf24" />
              </div>
            </div>
          </div>

          <div>
            <label className='label'>
              <span className='text-base text-black label-text'>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='••••••••'
                className='w-full input input-bordered h-10'
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <div
                className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer"
                onClick={togglePasswordVisibility} // Trigger state update on click
              >
                {!formData.password ? (
                   <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10" color="#fbbf24" />
                ) : showPassword ? (
                  <EyeClosed color="#f59e0b" className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10" />
                ) : (
                  <Eye color="#f59e0b" className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10" />
                )}
              </div>
            </div>
          </div>

          <div>
            <label className='label'>
              <span className='text-black text-base label-text'>Confirm Password</span>
            </label>
            <div className="relative">
            <input
              type='password'
              placeholder='Confirm Password'
              autoComplete="confirmPass"
              className='w-full input input-bordered h-10'
              value={formData.confirmPass}
              onChange={(e) => setFormData({ ...formData, confirmPass: e.target.value })}
            />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer">
                  <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10" color="#fbbf24" />
              </div>
            </div>
            
          </div>


          <Link className='text-black text-sm hover:underline hover:text-blue-600 mt-2 inline-block' to='/login'>
            Already have an account?
          </Link>

          <div>
            <button className='btn btn-block btn-sm mt-2 border border-slate-800'>Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUp;
