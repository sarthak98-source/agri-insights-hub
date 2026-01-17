import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Leaf,
  Info,
  Package,
  AlertTriangle,
  Cloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

const publicNavLinks = [
  { path: "/", label: "Home", icon: Leaf },
  { path: "/about", label: "About", icon: Info },
];

const protectedNavLinks = [
  { path: "/dashboard", label: "Dashboard", icon: Leaf },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/alerts", label: "Alerts", icon: AlertTriangle },
  { path: "/weather", label: "Weather", icon: Cloud },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-bold hidden sm:block">Smart Agri</span>
          </Link>

          {/* Desktop Nav - Only show public links when signed out */}
          <SignedOut>
            <div className="hidden md:flex gap-1">
              {publicNavLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </SignedOut>

          {/* When signed in, show protected links */}
          <SignedIn>
            <div className="hidden md:flex gap-1">
              {protectedNavLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </SignedIn>

          {/* Auth */}
          <div className="hidden md:block">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Signuo/Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <SignedOut>
              {publicNavLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="w-full">
                  Signin/Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {protectedNavLinks.map((link) => {
                const Icon = link.icon;
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="px-4 py-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        )}
      </div>
    </nav>
  );
};