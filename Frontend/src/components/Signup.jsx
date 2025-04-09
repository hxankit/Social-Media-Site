import React, { useEffect, useRef, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const Signup = () => {
    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        otp: ''
    });

    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const otpInputRef = useRef(null);
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);

    const changeHandler = (e) => {
        setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const sendOtpHandler = async () => {
        if (!input.email) {
            toast.error("Please enter your email to get OTP");
            return;
        }

        if (!isValidEmail(input.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        try {
            setOtpLoading(true);

            const res = await axios.post('http://localhost:8000/api/v1/user/sendOtp', {
                email: input.email
            });

            if (res.data.message) {
                toast.success("OTP sent successfully to your email");
                setOtpSent(true);

                // Autofocus OTP input after sending
                setTimeout(() => {
                    otpInputRef.current?.focus();
                }, 200);
            }
        } catch (error) {
            console.error("Send OTP Error:", error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setOtpLoading(false);
        }
    };

    const signupHandler = async (e) => {
        e.preventDefault();

        if (!input.otp) {
            toast.error("Please enter the OTP to register");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success || res.status === 201) {
                toast.success(res.data.message);
                setInput({ username: "", email: "", password: "", otp: "" });

                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            }
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) navigate('/');
    }, [user]);

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 w-full max-w-md'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Signup to see photos & videos from your friends</p>
                </div>

                <div>
                    <span className='font-medium'>Username</span>
                    <Input
                        type="text"
                        name="username"
                        value={input.username}
                        onChange={changeHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>

                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>

                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>

                <div className='flex items-center gap-4'>
                    <Button
                        type="button"
                        onClick={sendOtpHandler}
                        disabled={otpLoading || !input.email}
                    >
                        {otpLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Get OTP"
                        )}
                    </Button>

                    {otpSent && (
                        <Input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={input.otp}
                            onChange={changeHandler}
                            ref={otpInputRef}
                        />
                    )}
                </div>

                {loading ? (
                    <Button disabled>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait
                    </Button>
                ) : (
                    <Button type="submit">Signup</Button>
                )}

                <span className='text-center'>
                    Already have an account? <Link to="/login" className='text-blue-600'>Login</Link>
                </span>
            </form>
        </div>
    );
};

export default Signup;
