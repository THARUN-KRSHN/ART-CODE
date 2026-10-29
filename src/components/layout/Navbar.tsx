"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/types";
import { RoleSwitcher } from "@/components/common/RoleSwitcher";
import {
  Menu,
  X,
  Bell,
  Layers,
  Shield,
  LogOut,
  ChevronRight,
  Compass,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setCurrentUser(data.user);

        // Fetch unread notifications count
        if (data.user) {
          const nRes = await fetch("/api/notifications");
          const nData = await nRes.json();
          const unread = (nData.notifications || []).filter(
            (n: any) => !n.readBy.includes(data.user.id)
          ).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to load user in Navbar", err);
      }
    }
    loadUser();
  }, [pathname]);

  const navLinks = [
    { label: "About", href: "/event" },
    { label: "Challenges", href: "/challenges" },
    { label: "Guidelines", href: "/guidelines" },
    { label: "Prizes", href: "/#prizes" },
    { label: "FAQs", href: "/#faqs" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-ivory-100/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-ink flex items-center justify-center text-ivory font-mono font-bold text-sm tracking-tighter group-hover:bg-terracotta transition-colors shadow-subtle">
            //
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-ink text-lg leading-none font-sans">
                ART<span className="text-terracotta font-serif font-normal italic px-0.5">//</span>CODE
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-ivory-200 text-ink-secondary border border-border">
                2026
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-ink-muted uppercase font-mono">
              DELTA × CCE IRINJALAKUDA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-terracotta ${
                  isActive ? "text-terracotta font-semibold" : "text-ink-secondary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <RoleSwitcher />

          {currentUser ? (
            <div className="flex items-center gap-3 pl-2 border-l border-border">
              {currentUser.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-terracotta-50 text-terracotta hover:bg-terracotta-100 transition-colors border border-terracotta-200"
                >
                  <Shield size={13} />
                  Admin
                </Link>
              )}

              <Link
                href="/notifications"
                className="relative p-2 rounded-lg text-ink-secondary hover:text-ink hover:bg-ivory-200 transition-colors"
                title="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-terracotta text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-ink text-white hover:bg-ink-pure transition-colors shadow-subtle"
              >
                <span>Dashboard</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-ink hover:text-terracotta hover:bg-ivory-200 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-ink text-white hover:bg-ink-pure transition-colors shadow-subtle"
              >
                Register Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <RoleSwitcher />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-ink hover:bg-ivory-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-ink hover:bg-ivory-100 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-ink text-white"
                >
                  Go to Dashboard
                </Link>
                {currentUser.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-terracotta-50 text-terracotta border border-terracotta-200"
                  >
                    Admin Overview
                  </Link>
                )}
                <Link
                  href="/notifications"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 rounded-lg text-sm text-ink-secondary hover:bg-ivory-100"
                >
                  Notifications ({unreadCount})
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-medium border border-border text-ink"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-ink text-white"
                >
                  Register Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

