import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { MdSchool, MdBusinessCenter } from 'react-icons/md'

const RegisterPage = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [referralCode, setReferralCode] = useState('')
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)
    const [role, setRole] = useState('student') // Default logic: student = seller, client = buyer

    const location = useLocation()
    const navigate = useNavigate()

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if (userInfo) {
            navigate(redirect)
        }
    }, [navigate, userInfo, redirect])

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const refParam = urlParams.get('ref');
        if (refParam) {
            setReferralCode(refParam);
        }
    }, [location]);

    const submitHandler = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            setMessage(null)
            try {
                const config = { headers: { 'Content-Type': 'application/json' } }
                await axios.post('/api/users', { name, email, password, role, referralCode }, config)
                navigate('/login?registration=success')
            } catch (error) {
                setError(error.response?.data?.message || error.message)
            }
        }
    }

    return (
        <div className='flex justify-center items-center min-h-[90vh] py-10'>
            <div className='w-full max-w-lg bg-[var(--bg-card)] backdrop-blur-md rounded-3xl shadow-xl border border-[var(--border-color)] p-8'>
                <h1 className='text-3xl font-black mb-2 text-center text-[var(--text-main)]'>Create Account</h1>
                <p className='text-center text-[var(--text-dim)] mb-8'>Join ProjectProof Marketplace</p>

                {message && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

                <form onSubmit={submitHandler}>
                    <label className='block text-[var(--text-dim)] text-xs font-bold mb-2 uppercase tracking-wide'>I want to:</label>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div
                            onClick={() => setRole('student')}
                            className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'student' ? 'border-blue-500 bg-blue-50/10' : 'border-[var(--border-color)] hover:border-blue-300'}`}
                        >
                            <MdSchool size={30} className={role === 'student' ? 'text-blue-500' : 'text-gray-400'} />
                            <span className={`font-bold text-sm ${role === 'student' ? 'text-blue-500' : 'text-gray-500'}`}>Sell Projects</span>
                            <span className="text-[10px] text-gray-400 text-center leading-tight">I am a Student</span>
                        </div>
                        <div
                            onClick={() => setRole('client')}
                            className={`cursor-pointer border-2 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${role === 'client' ? 'border-green-500 bg-green-50/10' : 'border-[var(--border-color)] hover:border-green-300'}`}
                        >
                            <MdBusinessCenter size={30} className={role === 'client' ? 'text-green-500' : 'text-gray-400'} />
                            <span className={`font-bold text-sm ${role === 'client' ? 'text-green-500' : 'text-gray-500'}`}>Buy Projects</span>
                            <span className="text-[10px] text-gray-400 text-center leading-tight">I am a Client/Buyer</span>
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-[var(--text-main)] text-sm font-bold mb-2' htmlFor='name'>Full Name</label>
                        <input
                            className='w-full px-4 py-3 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                            id='name'
                            type='text'
                            placeholder='e.g. Akshay Shelke'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-[var(--text-main)] text-sm font-bold mb-2' htmlFor='email'>Email Address</label>
                        <input
                            className='w-full px-4 py-3 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                            id='email'
                            type='email'
                            placeholder='name@example.com'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-[var(--text-main)] text-sm font-bold mb-2' htmlFor='password'>Password</label>
                        <input
                            className='w-full px-4 py-3 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                            id='password'
                            type='password'
                            placeholder='Strong password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-8'>
                        <label className='block text-[var(--text-main)] text-sm font-bold mb-2' htmlFor='confirmPassword'>Confirm Password</label>
                        <input
                            className='w-full px-4 py-3 rounded-xl bg-[var(--bg-deep)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                            id='confirmPassword'
                            type='password'
                            placeholder='Repeat password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className='mb-8'>
                        <label className='block text-[var(--text-main)] text-sm font-bold mb-2' htmlFor='referralCode'>Referral/Affiliate Code (Optional)</label>
                        <input
                            className='w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50/10 to-transparent border border-blue-500/30 text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
                            id='referralCode'
                            type='text'
                            placeholder='e.g. 5F8D3A'
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value)}
                        />
                    </div>

                    <button
                        className='w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all'
                        type='submit'
                    >
                        Create Account
                    </button>
                </form>
                <div className='mt-6 text-center'>
                    <p className='text-sm text-[var(--text-dim)]'>Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className='text-blue-500 font-bold hover:underline'>Sign In</Link></p>
                </div>
            </div>
        </div>
    )
}

export default RegisterPage
