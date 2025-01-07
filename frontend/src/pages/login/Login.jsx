import { Link } from "react-router-dom";

const LogIn = () => {return (
  <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
      <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
          <h1 className='text-3xl font-semibold text-center text-gray-800'>
              Login
              <span className='text-yellow-500'style={{ textShadow: '2px 2px 5px black, -2px -2px 5px black' }}> BuzzChat</span>
          </h1>

          <form>
              <div>
                  <label className='label p-2'>
                      <span className='text-base text-black label-text'>Email</span>
                  </label>
                  <input type='text' autoComplete="username"  placeholder='Enter Email' className='w-full input input-bordered h-10' />
              </div>

              <div>
                  <label className='label'>
                      <span className='text-base text-black label-text'>Password</span>
                  </label>
                  <input
                      type='password'
                      placeholder='Enter Password'
                      className='w-full input input-bordered h-10'
                      autoComplete="current-password"
                  />
              </div>
              <span className='text-sm mt-2 inline-block text-black'>Don't have an account? </span>
              <Link to='/signup' className='p-1 text-sm hover:underline hover:text-blue-700 inline-block text-black cursor-pointer'>
               Create account
              </Link>

              <div>
                  <button className='btn btn-block btn-sm mt-2'>Login</button>
              </div>
          </form>
      </div>
  </div>
);
}
export default LogIn;