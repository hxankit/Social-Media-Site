import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate('/');
        toast.success(res.data.message);
        setInput({ email: '', password: '' });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) navigate('/');
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100'>
      <form
        onSubmit={loginHandler}
        className='bg-white p-8 shadow-xl rounded-xl w-full max-w-md flex flex-col gap-6'
      >
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-blue-600 mb-1'>SyncroLink</h1>
          <p className='text-gray-500 text-sm'>Login to see photos & videos from your friends</p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <Input
            type='email'
            name='email'
            value={input.email}
            onChange={changeEventHandler}
            placeholder='Enter your email'
            className='mt-2'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Password</label>
          <Input
            type='password'
            name='password'
            value={input.password}
            onChange={changeEventHandler}
            placeholder='Enter your password'
            className='mt-2'
          />
        </div>

        <Button type='submit' disabled={loading} className='w-full mt-2'>
          {loading ? (
            <>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        <p className='text-sm text-center text-gray-600'>
          Don’t have an account?{' '}
          <Link to='/signup' className='text-blue-600 font-semibold hover:underline'>
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
