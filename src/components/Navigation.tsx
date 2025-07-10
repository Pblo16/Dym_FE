import { fetchData } from "@/hooks/fetchData";
import { useStickyNavbar } from "@/hooks/useStickyNavbar";
import type Global from "@/interfaces/global";
import { NavLink } from "react-router";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { BaggageClaim, Menu } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const apiData = fetchData("/api/global");

/**
 * Navigation component with sticky behavior on scroll
 */
export function Navigation() {
    const apiResponse = apiData.read();
    const data: Global = apiResponse.data;
    const { isSticky, navbarRef, sentinelRef } = useStickyNavbar("-1px");

    /**
     * Generates common navigation link className
     */
    const getLinkClassName = () =>
        "font-medium text-lg hover:underline underline-offset-4";

    /**
     * Renders the logo section of the navigation
     */
    const renderLogo = () => (
        <NavLink to="/" className="flex items-center gap-2">
            <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="size-8 md:size-10"
                alt="Logo"
            />
            <span className="font-semibold text-lg">{data?.siteName || "Site Name"}</span>
        </NavLink>
    );

    const renderNavbarRight = () => (
        <div className="flex items-center gap-6">
            <BaggageClaim size={32} strokeWidth={1} />
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><NavLink to="/profile">Profile</NavLink></DropdownMenuItem>
                    <DropdownMenuItem><NavLink to="/billing">Billing</NavLink></DropdownMenuItem>
                    <DropdownMenuItem><NavLink to="/team">Team</NavLink></DropdownMenuItem>
                    <DropdownMenuItem><NavLink to="/subscription">Subscription</NavLink></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );

    /**
     * Renders the desktop navigation links
     */
    const renderDesktopLinks = () => (
        <>
            <NavLink to="/" className={getLinkClassName()}>
                Home
            </NavLink>
            <NavLink to="/products" className={getLinkClassName()}>
                Products
            </NavLink>
            <NavLink to="#" className={getLinkClassName()}>
                Services
            </NavLink>
            <NavLink to="#" className={getLinkClassName()}>
                Contact
            </NavLink>
        </>
    );

    /**
     * Renders the mobile navigation menu
     */
    const renderMobileMenu = () => (
        <div className="md:hidden flex items-center gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu className="w-6 h-6" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="gap-4 grid p-4 w-[200px]">
                        <NavLink to="/" className={getLinkClassName()}>
                            Home
                        </NavLink>
                        <NavLink to="/products" className={getLinkClassName()}>
                            Products
                        </NavLink>
                        <NavLink to="#" className={getLinkClassName()}>
                            Services
                        </NavLink>
                        <NavLink to="#" className={getLinkClassName()}>
                            Contact
                        </NavLink>
                        <Button variant="outline">Get started</Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );

    /**
     * Renderiza el elemento sentinel para detectar cuando hacer sticky
     * @returns Elemento sentinel invisible
     */
    const renderSentinel = () => (
        <div
            ref={sentinelRef}
            className="w-full h-px pointer-events-none"
            aria-hidden="true"
        />
    );

    return (
        <>
            {renderSentinel()}
            <nav
                ref={navbarRef}
                id="navbar-sticky"
                className={cn(
                    "flex justify-between items-center dark:bg-accent shadow-lg px-12 py-4 w-full text-foreground",
                    "will-change-transform transition-all duration-200 ease-out",
                    isSticky && [
                        "sticky top-0 z-50",
                        "bg-background/96 backdrop-blur-sm",
                        "supports-[backdrop-filter]:bg-background/85",
                        "border-b border-border/30",
                        "shadow-none"
                    ]
                )}
                style={{
                    transform: isSticky
                        ? 'translateY(0) scale(0.98)'
                        : 'translateY(0) scale(1)',

                }}
            >
                <div className="flex items-center gap-8">
                    {renderLogo()}
                    <div className="hidden md:flex items-center gap-8">
                        {renderDesktopLinks()}
                    </div>
                </div>
                <div className="flex items-center gap-4 md:gap-8">

                    {renderNavbarRight()}

                    {renderMobileMenu()}
                </div>
            </nav>
        </>
    );
}



export default Navigation;
