import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, googleLogin } from '../../services/user/UserLoginSlice'
import { MdBolt } from "react-icons/md";
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const location = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get('redirect');

    useEffect(() => {
        if (userInfo) {
            if (redirectParam) {
                navigate(redirectParam);
            } else {
                // Role-based Redirect
                if (userInfo.isAdmin || userInfo.role === 'admin' || userInfo.role === 'freelancer' || userInfo.role === 'teacher') {
                    navigate('/dashboard');
                } else {
                    // Buyers (Students/Clients) land on Marketplace
                    navigate('/marketplace');
                }
            }
        }
    }, [navigate, userInfo, redirectParam])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }

    return (
        <div className='flex justify-center items-center py-20 min-h-[80vh] relative'>
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-glow)]/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className='w-full max-w-md bg-[var(--bg-card)] backdrop-blur-xl border border-[var(--border-color)] rounded-2xl shadow-2xl p-8 relative z-10'>
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-[var(--primary-glow)]/10 rounded-xl">
                        <MdBolt size={32} className="text-[var(--primary-glow)]" />
                    </div>
                </div>

                <h1 className='text-3xl font-black mb-2 text-center text-[var(--text-main)] tracking-tight'>Welcome Back</h1>
                <p className='text-center text-[var(--text-dim)] mb-8'>Sign in to access your verified projects</p>

                {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium text-center" role="alert">{error}</div>}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className='block text-[var(--text-dim)] text-xs font-bold uppercase tracking-wider mb-2' htmlFor='email'>Email Address</label>
                        <input
                            className='w-full p-4 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--primary-glow)] focus:ring-1 focus:ring-[var(--primary-glow)] transition-all'
                            id='email'
                            type='email'
                            placeholder='name@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className='block text-[var(--text-dim)] text-xs font-bold uppercase tracking-wider mb-2' htmlFor='password'>Password</label>
                        <input
                            className='w-full p-4 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] placeholder-[var(--text-dim)] focus:outline-none focus:border-[var(--primary-glow)] focus:ring-1 focus:ring-[var(--primary-glow)] transition-all'
                            id='password'
                            type='password'
                            placeholder='••••••••'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className='w-full bg-[var(--text-main)] text-[var(--bg-deep)] font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 uppercase tracking-wider text-sm flex justify-center items-center gap-2'
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="flex flex-col items-center gap-4 mt-4">
                        <div className="flex items-center w-full gap-4">
                            <div className="h-[1px] bg-[var(--border-color)] flex-1"></div>
                            <span className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest">or</span>
                            <div className="h-[1px] bg-[var(--border-color)] flex-1"></div>
                        </div>

                        <div className="w-full flex justify-center">
                            <GoogleLogin
                                onSuccess={credentialResponse => {
                                    dispatch(googleLogin(credentialResponse.credential));
                                }}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                useOneTap
                                theme="filled_black"
                                shape="pill"
                                width="100%"
                            />
                        </div>
                    </div>
                </form>

                <div className='mt-8 text-center pt-6 border-t border-[var(--border-color)]'>
                    <p className='text-sm text-[var(--text-dim)]'>
                        New to ProjectProof? <Link to={redirectParam ? `/register?redirect=${redirectParam}` : '/register'} className='text-[var(--primary-glow)] font-bold hover:underline'>Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
