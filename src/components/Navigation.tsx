import { fetchData } from "@/hooks/fetchData";
import type Global from "@/interfaces/global";
import { useEffect } from "react";
import { NavLink } from "react-router";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";


const apiData = fetchData("/api/global");
export function Navigation() {


    const apiResponse = apiData.read();
    const data: Global = apiResponse.data;

    return (
        <nav
            id="navbar-sticky"
            className="flex justify-between items-center bg-white dark:bg-accent px-4 py-4 w-full transition-all duration-300 ease-in-out"
        >
            <NavLink
                to="/"
                className="flex items-center gap-2"
            >
                <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    className="w-6 h-6"
                    alt="Logo"
                />
                <span className="font-semibold dark:text-white text-lg">
                    {data?.siteName || 'Site Name'}
                </span>
            </NavLink>

            <div className="hidden md:flex items-center gap-6">
                <NavLink
                    to="/"
                    className="font-medium text-lg hover:underline underline-offset-4"
                >
                    Home
                </NavLink>
                <NavLink
                    to="/products"
                    className="font-medium text-lg hover:underline underline-offset-4"
                >
                    Products
                </NavLink>
                <NavLink
                    to="#"
                    className="font-medium text-lg hover:underline underline-offset-4"
                >
                    Services
                </NavLink>
                <NavLink
                    to="#"
                    className="font-medium text-lg hover:underline underline-offset-4"
                >
                    Contact
                </NavLink>
                <Button variant="outline">
                    Get started
                </Button>
            </div>

            <div className="md:hidden flex items-center gap-2">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MenuIcon className="w-6 h-6" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                        <div className="gap-4 grid p-4 w-[200px]">
                            <NavLink
                                to="/"
                                className="font-medium text-lg hover:underline underline-offset-4"
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/products"
                                className="font-medium text-lg hover:underline underline-offset-4"
                            >
                                Products
                            </NavLink>
                            <NavLink
                                to="#"
                                className="font-medium text-lg hover:underline underline-offset-4"
                            >
                                Services
                            </NavLink>
                            <NavLink
                                to="#"
                                className="font-medium text-lg hover:underline underline-offset-4"
                            >
                                Contact
                            </NavLink>
                            <Button variant="outline">
                                Get started
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    );
}

export default Navigation;
