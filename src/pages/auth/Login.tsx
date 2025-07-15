import { LoginForm } from '@/components/auth/LoginForm';

/**
 * Login page component
 * Renders the login form in a centered layout
 */
export function Login() {
    return (
        <div className="flex justify-center items-center py-12 min-h-[calc(100vh-200px)]">
            <LoginForm />
        </div>
    );
}

export default Login;
