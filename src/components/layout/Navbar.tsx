"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks";
import { Button } from "@/components/ui";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, signOut, isLoading } = useAuth();

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/jobs", label: "Browse Jobs" },
  ];

  const getDashboardLink = () => {
    if (!user) return "/dashboard/applicant";
    return `/dashboard/${user.role}`;
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="referkaro logo"
              width={36}
              height={36}
              className="h-9 w-9"
              style={{ background: "transparent" }}
            />
            <span className="text-xl font-bold text-foreground">referkaro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <div className="flex items-center gap-4">
                    <Link
                      href={getDashboardLink()}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                        pathname.startsWith("/dashboard")
                          ? "text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <div className="flex items-center gap-3 border-l border-border pl-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div className="hidden lg:block">
                          <p className="text-sm font-medium text-foreground">
                            {user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {user?.role}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={signOut}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        Log in
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button size="sm">Get Started</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-1 px-4 py-4">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <>
                    <Link
                      href={getDashboardLink()}
                      className={cn(
                        "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        pathname.startsWith("/dashboard")
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium text-foreground">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user?.role}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="border-t border-border pt-3 mt-3 space-y-2">
                    <Link
                      href="/login"
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export { Navbar };
