import React, { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';

const Login = () => {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false); // Corrected declaration

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };
    const navigate = useNavigate()
    const dispatch=useDispatch()
    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            });
            if (res.data.success) {
                navigate("/")
                dispatch(setAuthUser(res.data.user))
                toast.success(res.data.message);
                setInput({

                    email: '',
                    password: ''
                });
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center w-screen h-screen justify-center">
            <form onSubmit={loginHandler} className="shadow-lg flex flex-col gap-5 p-8">
                <div className="py-1">
                    <h1 className="text-center font-bold text-xl">Login</h1>
                    <p className="text-sm">Login Here To Get Photos And Videos</p>
                </div>

                <div>
                    <Label>Email</Label>
                    <Input
                        type="email"
                        placeholder="Email"
                        className="focus-visible:ring-transparent"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                    />
                </div>
                <div>
                    <Label>Password</Label>
                    <Input
                        type="password"
                        placeholder="Password"
                        className="focus-visible:ring-transparent"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "logging..." : "Login"}
                </Button>
                <span>Don't Have An Account <Link to='/signup' className='text-blue-500'>Signup</Link></span>
            </form>
        </div>
    );
};

export default Login;
