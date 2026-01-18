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
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";

/* ---------- NAV LINKS ---------- */

const publicNavLinks = [
  { path: "/", label: "Home", icon: Leaf },
  { path: "/about", label: "About", icon: Info },
];

const protectedNavLinks = [
  { path: "/dashboard", label: "Dashboard", icon: Leaf },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/alerts", label: "Alerts", icon: AlertTriangle },
  { path: "/weather", label: "Weather", icon: Cloud },
  {
    path: "/demand-prediction",
    label: "Demand Prediction",
    icon: TrendingUp,
  },
];

/* ---------- NAVBAR ---------- */

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const renderLink = (link: any, onClick?: () => void) => {
    const Icon = link.icon;
    const active = location.pathname === link.path;

    return (
      <Link
        key={link.path}
        to={link.path}
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-secondary"
        )}
      >
        <Icon className="h-4 w-4" />
        {link.label}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-primary text-primary-foreground rounded-lg">
              <Leaf className="h-5 w-5" />
            </div>
            <span className="font-bold hidden sm:block">
              Smart Agri
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            <SignedOut>
              {publicNavLinks.map((link) => renderLink(link))}
            </SignedOut>

            <SignedIn>
              {protectedNavLinks.map((link) => renderLink(link))}
            </SignedIn>
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In / Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <SignedOut>
              {publicNavLinks.map((link) =>
                renderLink(link, () => setIsOpen(false))
              )}

              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In / Login
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {protectedNavLinks.map((link) =>
                renderLink(link, () => setIsOpen(false))
              )}

              <div className="px-4 pt-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
        )}
      </div>
    </nav>
  );
};
