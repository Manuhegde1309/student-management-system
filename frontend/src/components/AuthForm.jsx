import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from './AuthStore';

export default function AuthForm({
    title,
    userType,
    isLogin = true,
    redirectPath
}) {
    const [form, setForm] = useState({
        username: '',
        password: '',
        ...(isLogin ? {} : { email: '', confirmPassword: '' })
    });

    const navigate = useNavigate();
    const { login, setLoading, setError, loading, error, clearError } = useAuthStore();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            clearError();

            const endpoint = isLogin ? 'login' : 'register';
            const res = await axios.post(`http://localhost:3000/api/${userType}/${endpoint}`, form);

            if (isLogin) {
                login(res.data.user, res.data.token);
                navigate(redirectPath);
            } else {
                alert('Registration successful! Please login.');
                navigate(`/${userType}/login`);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || (isLogin ? 'Invalid credentials' : 'Registration failed');
            setError(errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToAlternate = () => {
        clearError();
        const alternatePath = isLogin ? `/${userType}/register` : `/${userType}/login`;
        navigate(alternatePath);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {title}
                    </h2>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <input
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                    />

                    {!isLogin && (
                        <input
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    )}

                    <input
                        className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                        type="password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    {!isLogin && (
                        <input
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Confirm Password"
                            type="password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        />
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
                    </button>

                    <button
                        onClick={handleNavigateToAlternate}
                        disabled={loading}
                        className={`w-full text-center text-sm text-indigo-600 hover:text-indigo-500 underline ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {isLogin ? 'Need to register?' : 'Already have an account?'}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        disabled={loading}
                        className={`w-full py-2 px-4 border border-indigo-600 text-indigo-600 text-sm font-medium rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}