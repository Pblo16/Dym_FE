import { SignupForm } from '@/components/auth/SignupForm';

/**
 * Signup page component
 * Renders the signup form in a centered layout
 */
export function Signup() {
    return (
        <div className="flex justify-center items-center py-12 min-h-[calc(100vh-200px)]">
            <SignupForm />
        </div>
    );
}

export default Signup;
