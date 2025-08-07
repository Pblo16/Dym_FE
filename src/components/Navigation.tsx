import { fetchData } from "@/hooks/fetchData";
import { useStickyNavbar } from "@/hooks/useStickyNavbar";
import type Global from "@/interfaces/global";
import { NavLink } from "react-router";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import LazyImage from "./LazyImage";

const apiData = fetchData("/api/global?populate=*");

/**
 * Navigation configuration structure
 * @interface NavigationItem
 */
interface NavigationItem {
    label: string;
    to: string;
    isActive?: boolean;
}

/**
 * Navigation menu configuration
 * @constant navigationConfig
 */
const navigationConfig: NavigationItem[] = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "About", to: "/about" },
];

/**
 * Navigation component with sticky behavior on scroll
 */
export function Navigation() {
    const apiResponse = apiData.read();
    const data: Global = apiResponse.data;
    const { isSticky, navbarRef, sentinelRef } = useStickyNavbar("-1px");

    /**
     * Generates common navigation link className
     * @returns CSS class string for navigation links
     */
    const getLinkClassName = () =>
        "font-medium text-lg hover:underline underline-offset-4";

    /**
     * Renders the logo section of the navigation
     * @returns JSX element for the logo section
     */
    const renderLogo = () => (
        <NavLink to="/" className="flex items-center gap-2">
            <LazyImage
                src={data?.favicon?.url || "https://flowbite.com/docs/images/logo.svg"}
                className="size-8 md:size-10"
                alt="Logo"
            />
            <span className="font-semibold text-lg">{data?.siteName || "Site Name"}</span>
        </NavLink>
    );

    /**
     * Renders a single navigation item
     * @param item - Navigation item configuration
     * @param className - Additional CSS classes
     * @returns JSX element for navigation item
     */
    const renderNavigationItem = (item: NavigationItem, className?: string) => (
        <NavLink
            key={item.label}
            to={item.to}
            className={className || getLinkClassName()}
        >
            {item.label}
        </NavLink>
    );

    /**
     * Renders navigation items from configuration
     * @param items - Array of navigation items
     * @param className - CSS classes for items
     * @returns JSX elements for navigation items
     */
    const renderNavigationItems = (items: NavigationItem[], className?: string) =>
        items.map(item => renderNavigationItem(item, className));

    /**
     * Renders the navbar right section
     * @returns JSX element for navbar right section
     */
    const renderNavbarRight = () => (
        <div className="flex items-center gap-6">
        </div>
    );

    /**
     * Renders the desktop navigation links from configuration
     * @returns JSX elements for desktop navigation links
     */
    const renderDesktopLinks = () => (
        <>
            {renderNavigationItems(navigationConfig)}
        </>
    );

    /**
     * Renders the mobile navigation menu from configuration
     * @returns JSX element for mobile navigation menu
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
                        {renderNavigationItems(navigationConfig, getLinkClassName())}
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
