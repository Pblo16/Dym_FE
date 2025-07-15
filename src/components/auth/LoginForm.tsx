import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { loginUser } from '@/api/auth';

/**
 * Login form component with email/password authentication
 * Handles user login and navigation after successful authentication
 */
export function LoginForm() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    /**
     * Handles input field changes
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        setError(''); // Clear error when user types
    };

    /**
     * Validates form data before submission
     */
    const validateForm = (): boolean => {
        if (!formData.identifier.trim()) {
            setError('Email or username is required');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        return true;
    };

    /**
     * Handles form submission and user authentication
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const response = await loginUser(formData);
            login(response.jwt, response.user);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 mx-auto w-full max-w-md">
            <div className="space-y-2 text-center">
                <h1 className="font-bold text-3xl">Sign In</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your credentials to access your account
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="identifier">Email or Username</Label>
                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        value={formData.identifier}
                        onChange={handleInputChange}
                        className="dark:bg-gray-700 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="dark:bg-gray-700 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Button
                        variant="link"
                        className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </Button>
                </p>
            </div>
        </div>
    );
}
