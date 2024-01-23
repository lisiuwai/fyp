import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useAuth } from '../context/authContext'; 
import { BiLowVision, BiShow } from 'react-icons/bi';

export default function Login() {
  const [userid, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); 
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const savedUserId = localStorage.getItem('rememberMeUserId');
    if (savedUserId) {
      setUserId(savedUserId);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    login(userid, password)
    .then(data => { 
      if (data.identify === 'teacher') {
        router.push('/teacher');
      } else {
        router.push('/');
      }
    })
      .catch((error) => {
        console.log('Error object:', error);
        if (error.status === 401) {
          alert('No account exists with the provided UserID.');
        } else if (error.status === 403) {
          alert('Incorrect Password.');
        } else {
          alert('Login failed. Please try again later.');
        }
        console.error('Login failed:', error);
      });

      if (rememberMe) {
        localStorage.setItem('rememberMeUserId', userid);
      } else {
        localStorage.removeItem('rememberMeUserId');
      }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
     
        <div className="mb-4">
          <Image src="/image/a.gif" alt="Login Image" width={400} height={200} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
            User ID
          </label>
          <input
            id="userid"
            type="text"
            value={userid}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your User ID"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
  
        <div className="mb-6 relative">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your Password"
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <button
        type="button"
        className="absolute inset-y-12 right-0 pr-3 flex items-center text-sm leading-5"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <BiLowVision size = '2em'/> : <BiShow size = '2em'/>}
      </button>
       </div>

        <div className="mb-6">
          <label className="inline-block text-gray-700 text-sm font-bold mb-2" htmlFor="rememberMe">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 leading-tight"
            />
            Remember me
          </label>
        </div>
       
        <div className="mb-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
