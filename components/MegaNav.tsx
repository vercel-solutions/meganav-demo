"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { ChevronDown, CheckCircle } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { ReactNode } from "react";

// Types
interface NavDropdownItem {
  title: string;
  href: string;
}

interface NavigationData {
  items: Array<{
    title: string;
    href?: string;
    dropdown?: {
      title: string;
      items: NavDropdownItem[];
    };
  }>;
}

// Reusable components
interface NavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

const NavLink = ({ href, className, children, ...props }: NavLinkProps) => (
  <Link
    href={href}
    className={`block transition-colors ${className}`}
    {...props}
  >
    {children}
  </Link>
);

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

const MegaNav = ({ fallbackData }: { fallbackData: NavigationData }) => {
  const [state, setState] = useState({
    mobileMenuOpen: false,
    showUpdateNotification: false,
    isProductsOpen: false,
  });
  const pathname = usePathname();

  const { data: nav } = useSWR<NavigationData>("/api/navigation", fetcher, {
    fallbackData,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: true,
    refreshInterval: 10, // Poll for fresh data every 30 seconds
  });

  useEffect(() => {
    const handleResize = () =>
      window.innerWidth >= 768 &&
      setState((prev) => ({ ...prev, mobileMenuOpen: false }));

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setState((prev) => ({ ...prev, mobileMenuOpen: false }));
  }, [pathname]);

  const commonLinkStyles = (isActive: boolean) => `
    ${
      isActive
        ? "bg-secondary dark:bg-secondary text-secondary-foreground dark:text-secondary-foreground"
        : "hover:bg-secondary/50 dark:hover:bg-secondary/50 text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground"
    }
    transition-colors
  `;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background dark:bg-background shadow-sm">
      {state.showUpdateNotification && (
        <div className="bg-emerald-500 text-white py-1.5 px-4 text-center text-sm">
          <div className="container mx-auto flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Navigation has been updated with new product information!
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavLink href="/" className="flex items-center space-x-2">
            <svg
              width="26"
              height="26"
              viewBox="0 0 76 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-foreground dark:text-foreground"
            >
              <path
                d="M37.5274 0L75.0548 65H0L37.5274 0Z"
                fill="currentColor"
              />
            </svg>
            <span className="sr-only">Home</span>
          </NavLink>

          <nav className="hidden md:flex items-center space-x-1">
            {nav?.items.map((item, index) => (
              <div
                key={index}
                className="mega-nav-item"
                onMouseEnter={() =>
                  item.title === "Products" &&
                  setState((prev) => ({ ...prev, isProductsOpen: true }))
                }
                onMouseLeave={() =>
                  item.title === "Products" &&
                  setState((prev) => ({ ...prev, isProductsOpen: false }))
                }
                onFocus={() =>
                  item.title === "Products" &&
                  setState((prev) => ({ ...prev, isProductsOpen: true }))
                }
                onBlur={() =>
                  item.title === "Products" &&
                  setState((prev) => ({ ...prev, isProductsOpen: false }))
                }
              >
                {item.href ? (
                  <NavLink
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${commonLinkStyles(
                      pathname === item.href
                    )}`}
                  >
                    {item.title}
                  </NavLink>
                ) : (
                  <button
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${commonLinkStyles(
                      false
                    )}`}
                  >
                    {item.title}
                    <ChevronDown className="ml-1 h-4 w-4 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                )}

                {item.dropdown && (
                  <div className="mega-nav-dropdown bg-background dark:bg-background shadow-lg rounded-lg border p-4 w-64">
                    <div className="grid gap-2">
                      <div className="mb-2 text-xs font-medium text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                        {item.dropdown.title}
                      </div>
                      {item.dropdown.items.map((dropdownItem, idx) => (
                        <NavLink
                          key={idx}
                          href={dropdownItem.href}
                          className={`p-3 hover:bg-secondary dark:hover:bg-secondary rounded-md ${
                            dropdownItem.title.includes("⏱️")
                              ? "border-l-2 border-emerald-500"
                              : ""
                          }`}
                        >
                          <div className="font-medium dark:text-foreground">
                            <span>{dropdownItem.title}</span>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary"
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  mobileMenuOpen: !prev.mobileMenuOpen,
                }))
              }
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={`transform transition-transform duration-300 ${
                  state.mobileMenuOpen ? "rotate-90" : ""
                }`}
              >
                <path
                  d={
                    state.mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden border-t overflow-hidden transition-all duration-300 ease-in-out ${
          state.mobileMenuOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="container mx-auto px-4 py-3 space-y-1">
          {nav?.items.map((item, index) => (
            <div key={index}>
              {item.href ? (
                <NavLink
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-base font-medium ${commonLinkStyles(
                    pathname === item.href
                  )}`}
                >
                  {item.title}
                </NavLink>
              ) : (
                <div className="px-3 py-2 text-base font-medium">
                  <div className="font-medium mb-1 text-muted-foreground">
                    {item.title}
                  </div>
                  {item.dropdown && (
                    <div className="pl-4 border-l border-border space-y-1 mt-1">
                      {item.dropdown.items.map((dropdownItem, idx) => (
                        <NavLink
                          key={idx}
                          href={dropdownItem.href}
                          className={`py-2 text-sm ${
                            dropdownItem.title.includes("⏱️")
                              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 rounded"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <div className="font-medium dark:text-foreground">
                            <span>{dropdownItem.title}</span>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default MegaNav;
