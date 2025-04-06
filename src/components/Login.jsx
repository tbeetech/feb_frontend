import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {useLoginUserMutation} from '../redux/features/auth/authApi'
import { setCredentials } from '../redux/features/auth/authSlice'
import { motion } from 'framer-motion'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const Login = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const [loginUser, {isLoading: loginLoading}] = useLoginUserMutation()
    const navigate = useNavigate()

    // Reset error message when inputs change
    useEffect(() => {
        if (message) setMessage('');
    }, [email, password]);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = {
            email,
            password
        }
        try {
            const response = await loginUser(data).unwrap();
            console.log(response)
            const {token, user} = response;
            dispatch(setCredentials({user, token}))
            
            // Store to localStorage if remember me is checked
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            navigate("/")
        } catch (error) {
            setMessage('Invalid email or password. Please try again.');
        }
    }
  
    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-sm text-gray-500">
                        Sign in to access your account
                    </p>
                </div>
                
                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                    <div className="rounded-md space-y-4">
                        <div className="relative">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                                placeholder="Email address"
                            />
                        </div>
                        
                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full pr-10 px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                                placeholder="Password"
                            />
                            <div 
                                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer mt-7" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FaRegEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaRegEye className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 text-red-500 p-3 rounded-md text-sm"
                        >
                            {message}
                        </motion.div>
                    )}
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-black hover:text-gray-800">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                        >
                            {loginLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {loginLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-black hover:text-gray-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

export default Login