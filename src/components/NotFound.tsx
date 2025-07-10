import { NavLink } from "react-router";


export function NotFound() {
    return (
        <div className="flex flex-col justify-center items-center px-4 h-[calc(100vh-90px)]">
            <h1 className="mb-4 font-bold text-4xl">404 - Page Not Found</h1>
            <p className="mb-8 text-gray-600 text-lg">The page you are looking for does not exist.</p>
            <NavLink to="/" className="text-blue-500">Go back to Home</NavLink>
        </div>
    );
}   