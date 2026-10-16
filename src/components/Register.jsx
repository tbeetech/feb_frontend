import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegisterUserMutation } from '../redux/features/auth/authApi';
import { motion } from 'framer-motion';
import { FaRegEye, FaRegEyeSlash, FaCheckCircle } from 'react-icons/fa';

const Register = () => {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [registerStep, setRegisterStep] = useState(1);
    const [passwordStrength, setPasswordStrength] = useState(0);
    
    const [registerUser, {isLoading}] = useRegisterUserMutation();
    const navigate = useNavigate();

    // Reset error message when inputs change
    useEffect(() => {
        if (message) setMessage('');
    }, [username, email, password, confirmPassword]);

    // Password strength checker
    useEffect(() => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        setPasswordStrength(strength);
    }, [password]);

    const validateStep1 = () => {
        if (!username.trim()) {
            setMessage('Please enter a username');
            return false;
        }
        if (!email.trim()) {
            setMessage('Please enter an email');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setMessage('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (!password) {
            setMessage('Please enter a password');
            return false;
        }
        if (password.length < 8) {
            setMessage('Password must be at least 8 characters');
            return false;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return false;
        }
        if (!agreeTerms) {
            setMessage('Please agree to the terms and conditions');
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setRegisterStep(2);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateStep2()) {
            return;
        }
        
        const data = {
            username,
            email,
            password
        };
        
        try {
            await registerUser(data).unwrap();
            
            // Show success message and redirect
            setRegisterStep(3);
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setMessage(error.data?.message || "Registration failed. Please try again.");
        }
    };
    
    const getStrengthColor = () => {
        if (passwordStrength === 0) return 'bg-gray-200';
        if (passwordStrength === 1) return 'bg-red-500';
        if (passwordStrength === 2) return 'bg-yellow-500';
        if (passwordStrength === 3) return 'bg-blue-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg"
            >
                {registerStep === 3 ? (
                    // Success confirmation view
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                            <FaCheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">Registration Successful!</h2>
                        <p className="mt-2 text-gray-600">Redirecting you to login...</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="text-center">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create an Account</h2>
                            <p className="text-sm text-gray-500">
                                Join our luxury community
                            </p>
                            
                            {/* Step indicator */}
                            <div className="flex items-center justify-center mt-6">
                                <div className={`h-2 w-10 rounded-full mr-2 ${registerStep >= 1 ? 'bg-black' : 'bg-gray-200'}`}></div>
                                <div className={`h-2 w-10 rounded-full ${registerStep >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
                            </div>
                        </div>
                    
                        {registerStep === 1 ? (
                            // Step 1: Basic information
                            <motion.form 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 space-y-6"
                            >
                                <div className="rounded-md space-y-4">
                                    <div className="relative">
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            required
                                            value={username}
                        onChange={(e) => setUsername(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                                            placeholder="Username"
                                        />
                                    </div>
                                    
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
                                
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.form>
                        ) : (
                            // Step 2: Password
                            <motion.form 
                                onSubmit={handleRegister}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-8 space-y-6"
                            >
                                <div className="rounded-md space-y-4">
                                    <div className="relative">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
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
                                    
                                    {/* Password strength indicator */}
                                    {password && (
                                        <div className="space-y-1">
                                            <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${getStrengthColor()}`} 
                                                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                {passwordStrength === 0 && "Password is too weak"}
                                                {passwordStrength === 1 && "Password is weak"}
                                                {passwordStrength === 2 && "Password is fair"}
                                                {passwordStrength === 3 && "Password is good"}
                                                {passwordStrength === 4 && "Password is strong"}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <div className="relative">
                                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                        <input
                                            id="confirm-password"
                                            name="confirm-password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black"
                                            placeholder="Confirm password"
                                        />
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <input
                                            id="agree-terms"
                                            name="agree-terms"
                                            type="checkbox"
                                            checked={agreeTerms}
                                            onChange={() => setAgreeTerms(!agreeTerms)}
                                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                                        />
                                        <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                                            I agree to the <Link to="/terms" className="text-black font-medium hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-black font-medium hover:underline">Privacy Policy</Link>
                                        </label>
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
                                
                                <div className="flex justify-between space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setRegisterStep(1)}
                                        className="flex-1 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                        
                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-black hover:text-gray-800">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default Register