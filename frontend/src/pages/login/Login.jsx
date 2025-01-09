import { Link } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeClosed,Loader } from "lucide-react"
import { useState } from "react";
import {useAuthStore} from "../../store/useAuthStore"

const LogIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const { login, isLoggingIn } = useAuthStore();

    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(formData);
      login(formData);
    };
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };
    return (
        <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
            <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                <h1 className='text-3xl font-semibold text-center text-gray-800'>
                    Login
                    <span className='text-yellow-500' style={{ textShadow: '2px 2px 5px black, -2px -2px 5px black' }}> BuzzChat</span>
                </h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='label p-2'>
                            <span className='text-base text-black label-text'>Email</span>
                        </label>
                        <div className="relative">
                            <input type='text' autoComplete="username" placeholder='Enter Email' className='w-full input input-bordered h-10' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /> 
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10">
                                <Mail color="#fbbf24"  />
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
                                placeholder='Enter Password'
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
                                    <LockKeyhole className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10" color="#fbbf24" />
                                ) : showPassword ? (
                                    <EyeClosed color="#f59e0b" className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10" />
                                ) : (
                                    <Eye color="#f59e0b" className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10" /> 
                                )}
                            </div>
                        </div>
                    </div>
                    <span className='text-sm mt-2 inline-block text-black'>Don't have an account? </span>
                    <Link to='/signup' className='p-1 text-sm hover:underline hover:text-blue-700 inline-block text-black cursor-pointer'>
                        Create account
                    </Link>

                    <div>
                        <button className='btn btn-block btn-sm mt-2'  disabled={isLoggingIn}>
                        {isLoggingIn ? (
                            <>
                            <Loader className="h-5 w-5 animate-spin" />
                            Loading...
                            </>
                        ) : "Login"}</button>
                        
                    </div>
                </form>
            </div>
        </div>
    );
}
export default LogIn;